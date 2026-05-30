"use client";

import React, { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div
            style={{
              width: 28,
              height: 28,
              border: "2px solid rgba(0,240,255,0.25)",
              borderTopColor: "#00f0ff",
              borderRadius: "50%",
              animation: "spline-spin 0.9s linear infinite",
            }}
          />
          <style>{`@keyframes spline-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
