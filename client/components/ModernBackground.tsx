"use client";

import React, { useEffect, useRef } from "react";

export default function ModernBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexSrc = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentSrc = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime;
  uniform vec3 uPrimary;
  uniform float uLight; // 0.0 = dark theme, 1.0 = light theme

      // small hash/ noise
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = rot * p * 1.7;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv - 0.5;
        p.x *= uResolution.x / uResolution.y;

        float t = uTime * 0.4;

        // base flow
        float q = fbm(p * 1.2 - vec2(t * 0.2, t * 0.05));
        float r = fbm(p * 2.0 + q * 1.2 + vec2(t * 0.1, -t * 0.05));
        float f = fbm(p * 3.0 + r);

  // shape mask for center glow (tighter radius so it affects only the center)
  float d = length(p);
  // make a localized falloff: 1.0 in center, 0.0 outside radius
  float mask = 1.0 - smoothstep(0.18, 0.45, d);
  mask = max(mask, 0.0);
  // remove center shadow/glow in light mode (uLight==1)
  mask *= (1.0 - uLight);

    // smooth the fbm to avoid sharp spikes/pellets
    float fsm = smoothstep(0.15, 0.85, f);

    // dark and light base tones
    vec3 darkBase = vec3(0.02, 0.02, 0.035);
    vec3 lightBase = vec3(0.95, 0.96, 0.98);

    // blend primary into base; in light mode prefer lighter base and subtler primary
    vec3 darkMix = mix(darkBase, uPrimary, fsm);
    vec3 lightMix = mix(lightBase, uPrimary, fsm * 0.6);
    vec3 base = mix(darkMix, lightMix, uLight);

  // compose base color and mask (apply a subtle highlight/tint only where mask > 0)
  vec3 highlight = base + uPrimary * 0.12; // subtle tint from primary
  vec3 color = mix(base, highlight, mask);

    // gentle color grading, slightly lighter gamma in light mode
    color = pow(color, vec3(0.98 + 0.04 * uLight));

    // clamp to avoid tiny bright pellets
    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
      }
    `;

    function compileShader(type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vShader = compileShader(gl.VERTEX_SHADER, vertexSrc);
    const fShader = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vShader || !fShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionLoc = gl.getAttribLocation(program, "aPosition");
    const resLoc = gl.getUniformLocation(program, "uResolution");
    const timeLoc = gl.getUniformLocation(program, "uTime");
    const primaryLoc = gl.getUniformLocation(program, "uPrimary");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    function resize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resLoc, w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    // read computed primary color from CSS variable (hsl var stored as "H S% L%") or fallback
    function getPrimaryRGB() {
      try {
        const s = getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim();
        if (!s) return [0.22, 0.56, 0.96]; // fallback bluish
        // s is like "217.2 91.2% 59.8%" -> convert to rgb
        const parts = s.split(" ").map((p) => p.replace("%", ""));
        const h = parseFloat(parts[0]) / 360.0;
        const sat = parseFloat(parts[1]) / 100.0;
        const l = parseFloat(parts[2]) / 100.0;
        // hsl to rgb
        const a = sat * Math.min(l, 1.0 - l);
        const f = (n: number) => {
          const k = (n + h * 12.0) % 12.0;
          const color =
            l - a * Math.max(-1.0, Math.min(k - 3.0, Math.min(9.0 - k, 1.0)));
          return color;
        };
        return [f(0), f(8), f(4)];
      } catch (err) {
        return [0.22, 0.56, 0.96];
      }
    }

    const primaryRGB = getPrimaryRGB();
    gl.uniform3f(primaryLoc, primaryRGB[0], primaryRGB[1], primaryRGB[2]);

    // read background lightness from CSS var '--background' (H S% L%) and use as a theme hint
    function getBackgroundLightness() {
      try {
        const s = getComputedStyle(document.documentElement)
          .getPropertyValue("--background")
          .trim();
        if (!s) return 0.0;
        const parts = s.split(" ").map((p) => p.replace("%", ""));
        const l = parseFloat(parts[2]) / 100.0;
        return l; // 0..1
      } catch (err) {
        return 0.0;
      }
    }

    const lightness = getBackgroundLightness();
    // convert lightness to a simple 0..1 theme factor where >0.5 is light mode
    const themeFactor = Math.min(1, Math.max(0, (lightness - 0.35) / 0.65));
    const lightLoc = gl.getUniformLocation(program, "uLight");
    if (lightLoc) gl.uniform1f(lightLoc, themeFactor);

    // observe theme class changes to update uniforms when user toggles theme
    const mo = new MutationObserver(() => {
      const p = getPrimaryRGB();
      gl.uniform3f(primaryLoc, p[0], p[1], p[2]);
      const l = getBackgroundLightness();
      const tf = Math.min(1, Math.max(0, (l - 0.35) / 0.65));
      if (lightLoc) gl.uniform1f(lightLoc, tf);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let start = performance.now();
    function render(now: number) {
      const time = (now - start) * 0.001;
      gl.uniform1f(timeLoc, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      mo.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-20 w-full h-full"
      aria-hidden
    />
  );
}
