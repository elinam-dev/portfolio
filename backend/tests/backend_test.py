"""
Backend API tests for Katey Elinam Portfolio API.
Covers: health, cv, chat (single + multi-turn), polish, summarize, contact (valid+invalid), CORS.
"""
import os
import re
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://premium-dev-hub-15.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ===== Health =====
class TestHealth:
    def test_health_ok(self, session):
        r = session.get(f"{API}/health", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "ok"
        assert data["llm"] is True, "LLM should be configured (EMERGENT_LLM_KEY)"
        assert data["resend"] is False, "Resend should be disabled (no key)"
        assert "time" in data


# ===== CV =====
class TestCV:
    def test_cv_structure(self, session):
        r = session.get(f"{API}/cv", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == "Katey Elinam"
        assert "Full Stack" in data["title"]
        assert isinstance(data["projects"], list)
        assert len(data["projects"]) == 4
        # Validate first project shape
        p0 = data["projects"][0]
        for k in ("name", "tagline", "description", "stack", "image"):
            assert k in p0
        assert isinstance(data["experience"], list)
        assert len(data["experience"]) >= 2
        # Skills should be dict of categories with lists
        assert isinstance(data["skills"], dict)
        for cat in ("Languages", "Frontend", "Backend", "DevOps"):
            assert cat in data["skills"]
            assert isinstance(data["skills"][cat], list)
            assert len(data["skills"][cat]) > 0


# ===== Chat =====
class TestChat:
    def test_chat_top_skills(self, session):
        r = session.post(
            f"{API}/chat",
            json={"message": "What are his top skills?"},
            timeout=120,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "session_id" in data and data["session_id"]
        assert "reply" in data and isinstance(data["reply"], str) and len(data["reply"]) > 5
        # Reply must reference CV skills (no hallucinations)
        reply_l = data["reply"].lower()
        assert re.search(r"react|next\.?js|typescript|node|python", reply_l), (
            f"Reply should reference real CV skills, got: {data['reply']}"
        )
        # Save session id on class
        TestChat._session_id = data["session_id"]

    def test_chat_multiturn_docker(self, session):
        sid = getattr(TestChat, "_session_id", None)
        assert sid, "Previous chat test must populate session_id"
        r = session.post(
            f"{API}/chat",
            json={"session_id": sid, "message": "Has he worked with Docker?"},
            timeout=120,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["session_id"] == sid, "Session should persist across calls"
        reply_l = data["reply"].lower()
        # Docker is in CV — should answer affirmatively / reference docker
        assert "docker" in reply_l, f"Reply should reference Docker, got: {data['reply']}"


# ===== Polish =====
class TestPolish:
    def test_polish_rewrite(self, session):
        original = "hey i wanna build a site with you"
        r = session.post(f"{API}/polish", json={"text": original}, timeout=120)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "polished" in data
        polished = data["polished"].strip()
        assert len(polished) > 0
        assert polished.lower() != original.lower(), "Polished text should differ from original"
        # Should be more professional - typically capitalized first letter
        assert polished[0].isupper() or polished.startswith('"'), "Should start with capital"


# ===== Summarize =====
class TestSummarize:
    def test_summarize_project(self, session):
        r = session.post(
            f"{API}/summarize",
            json={"name": "Stock Hub", "description": "AI inventory", "tech_stack": ["React", "AI"]},
            timeout=120,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "summary" in data
        summary = data["summary"].strip()
        assert len(summary) > 10
        # Approximately 2 sentences — allow 1-4 sentences as tolerance
        sentences = [s for s in re.split(r"(?<=[.!?])\s+", summary) if s.strip()]
        assert 1 <= len(sentences) <= 4, f"Expected ~2 sentences, got {len(sentences)}: {summary}"


# ===== Contact =====
class TestContact:
    def test_contact_valid_persists(self, session):
        payload = {
            "name": "TEST_User",
            "email": "test_user@example.com",
            "subject": "TEST_Subject hello",
            "message": "TEST_Message: This is an automated backend test message.",
        }
        r = session.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data["stored"] is True
        assert data["delivered"] is False, "Resend key is empty, so delivered must be false"
        assert "id" in data and data["id"]

    def test_contact_invalid_email(self, session):
        payload = {
            "name": "TEST_BadEmail",
            "email": "not-an-email",
            "subject": "TEST_subject",
            "message": "TEST_message body",
        }
        r = session.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code == 422, f"Expected 422 for invalid email, got {r.status_code}: {r.text}"


# ===== CORS =====
class TestCORS:
    def test_cors_preflight(self, session):
        r = requests.options(
            f"{API}/contact",
            headers={
                "Origin": "https://example.com",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
            timeout=15,
        )
        # Should be 200 or 204, with CORS header
        assert r.status_code in (200, 204), r.text
        acao = r.headers.get("access-control-allow-origin", "")
        assert acao in ("*", "https://example.com"), f"Missing/invalid CORS header: {acao!r}"

    def test_cors_actual_post(self, session):
        r = requests.post(
            f"{API}/contact",
            headers={"Origin": "https://example.com", "Content-Type": "application/json"},
            json={
                "name": "TEST_CORS",
                "email": "cors_test@example.com",
                "subject": "TEST_CORS",
                "message": "TEST_CORS body",
            },
            timeout=30,
        )
        assert r.status_code == 200, r.text
        acao = r.headers.get("access-control-allow-origin", "")
        assert acao in ("*", "https://example.com"), f"Missing CORS header on response: {acao!r}"
