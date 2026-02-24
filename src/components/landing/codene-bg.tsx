'use client';

import { useEffect, useRef } from 'react';

const CODE_LINES = [
  'const app = createApp({ strict: true });',
  'import { useState, useEffect } from "react";',
  'async function fetchData(url: string) {',
  '  const res = await fetch(url);',
  '  return res.json();',
  '}',
  'export default function Home() {',
  '  const [data, setData] = useState(null);',
  '  useEffect(() => { loadData(); }, []);',
  'interface Props { children: ReactNode }',
  'const router = useRouter();',
  'app.use(cors({ origin: "*" }));',
  'db.query("SELECT * FROM users");',
  'console.log("Server running on :3000");',
  'npm install next react typescript',
  'git commit -m "feat: add auth"',
  'docker build -t app:latest .',
  'const token = jwt.sign(payload, secret);',
  'if (!session) redirect("/login");',
  'export const config = { runtime: "edge" };',
  'const stream = new ReadableStream({',
  '  start(controller) { /* ... */ }',
  '});',
  'app.post("/api/estimate", handler);',
  'const supabase = createClient(url, key);',
  'tailwind.config = { darkMode: "class" };',
  'function middleware(req: NextRequest) {',
  '  return NextResponse.next();',
  '}',
  'pnpm dev --turbo --port 3000',
  'const schema = z.object({ name: z.string() });',
];

export function CodeneBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      time += 0.006;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Calculate CODENE text size to span full width
      const targetWidth = w * 0.95;
      ctx.font = '900 300px system-ui, -apple-system, sans-serif';
      ctx.letterSpacing = '0.08em';
      const measured = ctx.measureText('CODENE');
      const scale = targetWidth / measured.width;
      // More conservative cap on mobile
      const maxRatio = w < 500 ? 0.32 : 0.45;
      const finalSize = Math.min(300 * scale, h * maxRatio);
      // Position letters so they're visible on mobile too
      const yPos = w < 500 ? h - finalSize * 0.05 : h - finalSize * 0.15;

      // Code text settings
      const codeFontSize = Math.max(10, finalSize * 0.055);
      const lineHeight = codeFontSize * 1.5;
      const scrollOffset = (time * 400) % (CODE_LINES.length * lineHeight);

      ctx.save();
      ctx.font = `400 ${codeFontSize}px "SF Mono", "Fira Code", "Consolas", monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Sweep effect
      const cycle = time % 1;
      const sweepWidth = targetWidth * 0.3;
      const textRight = (w / 2) + (targetWidth / 2);
      const sweepCenter = textRight - cycle * (targetWidth + sweepWidth);

      // Draw code lines across the FULL canvas width
      // Each row: repeat code text end-to-end from x=0 to x=w
      const totalCodeLines = CODE_LINES.length;
      const visibleLines = Math.ceil(h / lineHeight) + 4;
      const gap = codeFontSize * 3; // gap between repeated segments

      for (let i = -2; i < visibleLines; i++) {
        const lineIndex = ((i % totalCodeLines) + totalCodeLines) % totalCodeLines;
        const drawY = i * lineHeight - (scrollOffset % (totalCodeLines * lineHeight));

        if (drawY < -lineHeight || drawY > h + lineHeight) continue;

        // Draw this line's text repeatedly across the full width
        const lineText = CODE_LINES[lineIndex];
        const textWidth = ctx.measureText(lineText).width;
        const segmentWidth = textWidth + gap;
        // Offset each row slightly for visual variety
        const rowOffset = -(lineIndex * 47) % segmentWidth;

        let x = rowOffset;
        while (x < w + segmentWidth) {
          // Sweep brightness based on x position
          const segCenterX = x + textWidth / 2;
          const distFromSweep = Math.abs(segCenterX - sweepCenter);
          const sweepFactor = Math.max(0, 1 - distFromSweep / (sweepWidth * 1.2));
          const alpha = 0.18 + sweepFactor * 0.27;

          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillText(lineText, x, drawY);
          x += segmentWidth;
        }
      }
      ctx.restore();

      // Mask to CODENE letter shapes
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.font = `900 ${finalSize}px system-ui, -apple-system, sans-serif`;
      ctx.letterSpacing = '0.08em';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = 'white';
      ctx.fillText('CODENE', w / 2, yPos);
      ctx.restore();

      // Thin outline for depth
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = `900 ${finalSize}px system-ui, -apple-system, sans-serif`;
      ctx.letterSpacing = '0.08em';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.strokeText('CODENE', w / 2, yPos);
      ctx.restore();

      ctx.restore(); // Restore the DPR transform
      animFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="codene-canvas-bg"
      aria-hidden="true"
    />
  );
}
