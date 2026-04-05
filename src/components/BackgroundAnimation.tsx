'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    // Detect reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Mobile detection — reduce complexity
    const isMobile = () => window.innerWidth < 768;

    // Sphere parameters
    const LAYERS = 3;          // concentric shells
    const SEGMENTS = 28;       // lat/lon lines per shell (reduced on mobile)
    const MOB_SEGMENTS = 16;   // mobile segments

    // Rotation state
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;
    let pulse = 0;             // breathe phase

    // Project 3D point to 2D screen space (simple perspective)
    function project(x: number, y: number, z: number, radius: number, cx: number, cy: number) {
      const fov = 600;
      const z3d = z + fov;
      const scale = fov / z3d;
      return {
        sx: cx + x * scale * radius,
        sy: cy + y * scale * radius,
        alpha: Math.max(0, (z + 1) / 2),  // front face brighter
      };
    }

    // Rotate a unit-sphere point around X and Y axes
    function rotate(lat: number, lon: number) {
      let x = Math.cos(lat) * Math.cos(lon);
      let y = Math.sin(lat);
      let z = Math.cos(lat) * Math.sin(lon);

      // Rotate Y axis
      let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
      let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
      x = x1; z = z1;

      // Rotate X axis
      let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
      let z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
      y = y1; z = z2;

      // Rotate Z axis
      let x2 = x * Math.cos(rotZ) - y * Math.sin(rotZ);
      let y2 = x * Math.sin(rotZ) + y * Math.cos(rotZ);
      x = x2; y = y2;

      return { x, y, z };
    }

    // Iridescent color based on position + time
    function getColor(lat: number, lon: number, layer: number, alpha: number, t: number) {
      const hue = ((lat / Math.PI + 0.5) * 180 + (lon / (Math.PI * 2)) * 120 + t * 30 + layer * 60) % 360;
      const sat = 90 + layer * 5;
      const lum = 50 + alpha * 20;
      const opacity = 0.18 + alpha * 0.25 - layer * 0.03;
      return `hsla(${hue}, ${sat}%, ${lum}%, ${opacity})`;
    }

    function drawSphere(t: number) {
      if (!ctx || !canvas) return;
      const cx = W / 2;
      const cy = H * 0.42;
      const baseRadius = Math.min(W, H) * (isMobile() ? 0.28 : 0.22);
      const breathe = 1 + Math.sin(pulse) * 0.025;
      const segs = isMobile() ? MOB_SEGMENTS : SEGMENTS;

      for (let layer = 0; layer < LAYERS; layer++) {
        const shellScale = (0.72 + layer * 0.14) * breathe;
        const radius = baseRadius * shellScale;

        // --- Draw latitude circles ---
        for (let li = 0; li <= segs; li++) {
          const lat = -Math.PI / 2 + (Math.PI * li) / segs;
          ctx.beginPath();
          let started = false;
          for (let lo = 0; lo <= segs * 2; lo++) {
            const lon = (Math.PI * 2 * lo) / (segs * 2);
            const { x, y, z } = rotate(lat, lon);
            const { sx, sy, alpha } = project(x, y, z, radius, cx, cy);
            const color = getColor(lat, lon, layer, alpha, t);
            if (!started) {
              ctx.strokeStyle = color;
              ctx.lineWidth = 0.5 + layer * 0.2;
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.strokeStyle = color;
              // Redraw each tiny segment with its own color
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.strokeStyle = color;
              ctx.lineWidth = 0.4 + alpha * 0.6;
            }
            ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }

        // --- Draw longitude circles ---
        for (let lo = 0; lo < segs; lo++) {
          const lon = (Math.PI * 2 * lo) / segs;
          ctx.beginPath();
          for (let li = 0; li <= segs * 2; li++) {
            const lat = -Math.PI / 2 + (Math.PI * li) / (segs * 2);
            const { x, y, z } = rotate(lat, lon);
            const { sx, sy, alpha } = project(x, y, z, radius, cx, cy);
            const color = getColor(lat, lon, layer, alpha, t);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.4 + alpha * 0.6;
            if (li === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
      }
    }

    function drawGlow() {
      if (!ctx) return;
      const cx = W / 2;
      const cy = H * 0.42;
      const r = Math.min(W, H) * (isMobile() ? 0.35 : 0.28);
      const breathe = 1 + Math.sin(pulse) * 0.04;

      // Outer ambient glow layers
      const glows = [
        { r: r * 2.4 * breathe, color: 'rgba(120,0,255,0.035)' },
        { r: r * 1.8 * breathe, color: 'rgba(0,180,255,0.05)' },
        { r: r * 1.3 * breathe, color: 'rgba(0,255,220,0.07)' },
        { r: r * 0.9 * breathe, color: 'rgba(200,0,255,0.09)' },
        { r: r * 0.5 * breathe, color: 'rgba(100,200,255,0.12)' },
      ];

      for (const g of glows) {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, g.r);
        grad.addColorStop(0, g.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, g.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    function drawCoreGlow() {
      if (!ctx) return;
      const cx = W / 2;
      const cy = H * 0.42;
      const r = Math.min(W, H) * 0.08;
      const breathe = 1 + Math.sin(pulse * 1.5) * 0.05;

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * breathe);
      g.addColorStop(0, 'rgba(180,230,255,0.18)');
      g.addColorStop(0.4, 'rgba(100,180,255,0.08)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * breathe, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    // Floating ambient orbs in the background (performance safe)
    const orbs = [
      { ox: 0.15, oy: 0.2,  or: 0.18, hue: 260, spd: 0.0003 },
      { ox: 0.80, oy: 0.75, or: 0.22, hue: 200, spd: 0.0004 },
      { ox: 0.55, oy: 0.55, or: 0.14, hue: 320, spd: 0.0005 },
    ];

    function drawOrbs(t: number) {
      if (!ctx) return;
      for (const o of orbs) {
        const ox = (o.ox + Math.sin(t * o.spd * 1000 + o.hue) * 0.04) * W;
        const oy = (o.oy + Math.cos(t * o.spd * 1000 + o.hue) * 0.04) * H;
        const r = Math.min(W, H) * o.or;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        g.addColorStop(0, `hsla(${o.hue}, 90%, 60%, 0.12)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    }

    let lastT = 0;
    function frame(ts: number) {
      if (!ctx || !canvas) return;
      const dt = ts - lastT;
      lastT = ts;

      // Clear
      ctx.clearRect(0, 0, W, H);

      const t = ts * 0.001;

      // Update rotation
      const rotSpeed = prefersReduced ? 0 : 1;
      rotY += 0.003 * rotSpeed;
      rotX += 0.0015 * rotSpeed;
      rotZ += 0.0008 * rotSpeed;
      pulse += 0.012 * rotSpeed;

      // Draw background orbs first
      drawOrbs(t);

      // Draw sphere glow bloom
      drawGlow();

      // Draw wireframe sphere
      drawSphere(t);

      // Draw core bright spot
      drawCoreGlow();

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 1 }}
      />
      {/* Subtle vignette overlay to blend edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 42%, transparent 30%, #09090b 80%)',
        }}
      />
      {/* Bottom fade so content reads cleanly */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: 'linear-gradient(to top, #09090b, transparent)',
        }}
      />
    </div>
  );
}
