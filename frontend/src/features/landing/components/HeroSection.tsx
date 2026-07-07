import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  originalX: number;
  originalY: number;
}

export default function HeroSection() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const colors = [
      '#0F52BA', // Royal Blue
      '#C2185B', // Accent Rose
      '#1B5E20', // Deep Emerald
      '#E6A100', // Warning Gold
      '#0B0B0C', // Deep Charcoal
    ];

    const nodes: Node[] = [];
    const nodeCount = 45;

    // Initialize nodes scattered on canvas
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 3.5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        originalX: x,
        originalY: y,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid helper background lines
      ctx.strokeStyle = '#FAF9F6';
      ctx.lineWidth = 0.5;

      // Draw connection lines between nearby nodes
      ctx.strokeStyle = 'rgba(11, 11, 12, 0.05)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes and calculate physics forces
      nodes.forEach((node) => {
        // Base drift speed
        node.x += node.vx;
        node.y += node.vy;

        // Boundary bounce check
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Spring force attractor towards mouse pointer
        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = mouseX - node.x;
          const dy = mouseY - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const force = (150 - dist) / 150;
            node.x += (dx / dist) * force * 1.5;
            node.y += (dy / dist) * force * 1.5;
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw delicate coordinate ring around nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(11, 11, 12, 0.04)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-[#FAF9F6] pt-36 pb-28 md:pt-48 md:pb-40 flex items-center min-h-[92vh] border-b border-slate-200/50">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-[130px] opacity-60 animate-pulse" />
        <div className="absolute -bottom-[25%] -right-[5%] w-[50%] h-[50%] rounded-full bg-indigo-100/30 blur-[130px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left space-y-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-650 text-[10px] font-extrabold uppercase tracking-widest shadow-sm select-none">
              <Sparkles className="h-3.5 w-3.5 text-slate-800 animate-spin" />
              {t('heroBadge')}
            </div>

            {/* Cinematic Typography Headings */}
            <h1 className="text-display-big text-5xl sm:text-7xl md:text-[85px] leading-[0.88] text-slate-950 select-none">
              YOUR VOICE<br />SHAPES YOUR<br />COMMUNITY.
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-xl">
              {t('heroSubtitle')}
            </p>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/submit"
                className="btn-primary-pill inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-10 py-5 cursor-pointer shadow-lg shadow-slate-900/10"
              >
                {t('heroCtaPrimary')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="btn-secondary-pill inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 cursor-pointer shadow-sm"
              >
                {t('heroCtaSecondary')}
              </a>
            </div>
          </div>

          {/* Right Interactive Centerpiece Column */}
          <div className="lg:col-span-5 relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
            {/* Ambient Label */}
            <div className="absolute top-4 left-4 z-10 text-label-mono select-none pointer-events-none flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping"></span>
              Live Constituency Grievance Network
            </div>
            
            {/* Interactive Grid Map Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
          </div>

        </div>
      </div>
    </section>
  );
}
