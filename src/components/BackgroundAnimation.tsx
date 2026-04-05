'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId: number;
    let setupTimeout: ReturnType<typeof setTimeout>;

    const start = () => {
      // Non-null assertion: we checked ctx above
      const raw = canvas.getContext('2d', { alpha: true });
      if (!raw) return;
      const c = raw; // typed alias — fixes TS "possibly null" in all closures

      let W = 0, H = 0;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = () => window.innerWidth < 768;

      const resize = () => {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
      };
      resize();
      window.addEventListener('resize', resize, { passive: true });

      const LAYERS   = prefersReduced ? 1 : 3;
      const SEGMENTS = isMobile() ? 14 : 24;

      let rotX = 0, rotY = 0, rotZ = 0, pulse = 0;

      function project(x: number, y: number, z: number, radius: number, cx: number, cy: number) {
        const fov = 600;
        const scale = fov / (z + fov);
        return {
          sx:    cx + x * scale * radius,
          sy:    cy + y * scale * radius,
          alpha: Math.max(0, (z + 1) / 2),
        };
      }

      function rotate(lat: number, lon: number) {
        let x = Math.cos(lat) * Math.cos(lon);
        let y = Math.sin(lat);
        let z = Math.cos(lat) * Math.sin(lon);

        const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
        x = x1; z = z1;

        const y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
        y = y1; z = z2;

        const x2 = x * Math.cos(rotZ) - y * Math.sin(rotZ);
        const y2 = x * Math.sin(rotZ) + y * Math.cos(rotZ);
        return { x: x2, y: y2, z: z2 };
      }

      function getColor(lat: number, lon: number, layer: number, alpha: number, t: number) {
        const hue     = ((lat / Math.PI + 0.5) * 180 + (lon / (Math.PI * 2)) * 120 + t * 30 + layer * 60) % 360;
        const opacity = 0.18 + alpha * 0.25 - layer * 0.03;
        return `hsla(${hue},90%,${50 + alpha * 20}%,${opacity})`;
      }

      function drawSphere(t: number) {
        const cx = W / 2;
        const cy = H * 0.42;
        const baseRadius = Math.min(W, H) * (isMobile() ? 0.28 : 0.22);
        const breathe    = 1 + Math.sin(pulse) * 0.025;

        for (let layer = 0; layer < LAYERS; layer++) {
          const radius = baseRadius * (0.72 + layer * 0.14) * breathe;

          // latitude circles
          for (let li = 0; li <= SEGMENTS; li++) {
            const lat = -Math.PI / 2 + (Math.PI * li) / SEGMENTS;
            c.beginPath();
            for (let lo = 0; lo <= SEGMENTS * 2; lo++) {
              const lon          = (Math.PI * 2 * lo) / (SEGMENTS * 2);
              const { x, y, z } = rotate(lat, lon);
              const { sx, sy, alpha } = project(x, y, z, radius, cx, cy);
              c.strokeStyle = getColor(lat, lon, layer, alpha, t);
              c.lineWidth   = 0.4 + alpha * 0.6;
              lo === 0 ? c.moveTo(sx, sy) : c.lineTo(sx, sy);
            }
            c.stroke();
          }

          // longitude circles
          for (let lo = 0; lo < SEGMENTS; lo++) {
            const lon = (Math.PI * 2 * lo) / SEGMENTS;
            c.beginPath();
            for (let li = 0; li <= SEGMENTS * 2; li++) {
              const lat          = -Math.PI / 2 + (Math.PI * li) / (SEGMENTS * 2);
              const { x, y, z } = rotate(lat, lon);
              const { sx, sy, alpha } = project(x, y, z, radius, cx, cy);
              c.strokeStyle = getColor(lat, lon, layer, alpha, t);
              c.lineWidth   = 0.4 + alpha * 0.6;
              li === 0 ? c.moveTo(sx, sy) : c.lineTo(sx, sy);
            }
            c.stroke();
          }
        }
      }

      function drawGlows() {
        const cx = W / 2;
        const cy = H * 0.42;
        const r  = Math.min(W, H) * (isMobile() ? 0.35 : 0.28);
        const b  = 1 + Math.sin(pulse) * 0.04;

        for (const g of [
          { r: r * 2.4 * b, col: 'rgba(120,0,255,0.035)' },
          { r: r * 1.8 * b, col: 'rgba(0,180,255,0.05)'  },
          { r: r * 1.3 * b, col: 'rgba(0,255,220,0.07)'  },
          { r: r * 0.9 * b, col: 'rgba(200,0,255,0.09)'  },
          { r: r * 0.5 * b, col: 'rgba(100,200,255,0.12)' },
        ]) {
          const grad = c.createRadialGradient(cx, cy, 0, cx, cy, g.r);
          grad.addColorStop(0, g.col);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          c.beginPath();
          c.arc(cx, cy, g.r, 0, Math.PI * 2);
          c.fillStyle = grad;
          c.fill();
        }

        // core glow
        const cr = Math.min(W, H) * 0.08 * (1 + Math.sin(pulse * 1.5) * 0.05);
        const cg = c.createRadialGradient(cx, cy, 0, cx, cy, cr);
        cg.addColorStop(0,   'rgba(180,230,255,0.18)');
        cg.addColorStop(0.4, 'rgba(100,180,255,0.08)');
        cg.addColorStop(1,   'rgba(0,0,0,0)');
        c.beginPath();
        c.arc(cx, cy, cr, 0, Math.PI * 2);
        c.fillStyle = cg;
        c.fill();
      }

      const orbs = [
        { ox: 0.15, oy: 0.20, or: 0.18, hue: 260, spd: 0.0003 },
        { ox: 0.80, oy: 0.75, or: 0.22, hue: 200, spd: 0.0004 },
        { ox: 0.55, oy: 0.55, or: 0.14, hue: 320, spd: 0.0005 },
      ];

      function drawOrbs(t: number) {
        for (const o of orbs) {
          const ox = (o.ox + Math.sin(t * o.spd * 1000 + o.hue) * 0.04) * W;
          const oy = (o.oy + Math.cos(t * o.spd * 1000 + o.hue) * 0.04) * H;
          const r  = Math.min(W, H) * o.or;
          const g  = c.createRadialGradient(ox, oy, 0, ox, oy, r);
          g.addColorStop(0, `hsla(${o.hue},90%,60%,0.12)`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          c.beginPath();
          c.arc(ox, oy, r, 0, Math.PI * 2);
          c.fillStyle = g;
          c.fill();
        }
      }

      const rotSpeed = prefersReduced ? 0 : 1;

      // Throttle to 30 fps (24 on mobile) to halve main-thread budget
      let lastFrame = 0;
      const FRAME_MS = 1000 / (isMobile() ? 24 : 30);

      function frame(ts: number) {
        if (ts - lastFrame < FRAME_MS) {
          rafId = requestAnimationFrame(frame);
          return;
        }
        lastFrame = ts;

        c.clearRect(0, 0, W, H);

        const t = ts * 0.001;
        rotY  += 0.003  * rotSpeed;
        rotX  += 0.0015 * rotSpeed;
        rotZ  += 0.0008 * rotSpeed;
        pulse += 0.012  * rotSpeed;

        drawOrbs(t);
        drawGlows();
        drawSphere(t);

        rafId = requestAnimationFrame(frame);
      }

      rafId = requestAnimationFrame(frame);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
      };
    };

    // Defer heavy setup until after first user-interactive frame
    if ('scheduler' in window && typeof (window as any).scheduler?.postTask === 'function') {
      (window as any).scheduler.postTask(start, { priority: 'background' });
    } else {
      setupTimeout = setTimeout(start, 0);
    }

    return () => {
      clearTimeout(setupTimeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 42%, transparent 30%, #09090b 80%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to top, #09090b, transparent)' }}
      />
    </div>
  );
}
