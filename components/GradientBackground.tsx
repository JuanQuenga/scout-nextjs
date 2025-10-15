"use client";

import { Dithering, GrainGradient } from "@paper-design/shaders-react";

export function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Dithering
        style={{ height: "100%", width: "100%" }}
        colorBack="#000000"
        colorFront="#000863"
        shape="warp"
        type="4x4"
        size={2.5}
        speed={0.06}
      />
    </div>
  );
}
