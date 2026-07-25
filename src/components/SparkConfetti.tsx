import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export default function SparkConfetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.width = window.innerWidth;
        height = canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Confetti particles
    const colors = ["#ff3f6c", "#fd913c", "#ff90b3", "#feb175", "#ffffff"];
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }> = [];

    // Create particles from bottom corners and top center
    const spawnCount = 120;
    for (let i = 0; i < spawnCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 50, // Spawn above screen
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 6 - 3,
        speedY: Math.random() * 5 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        opacity: 1
      });
    }

    // Side fountains
    const spawnFountains = () => {
      for (let i = 0; i < 40; i++) {
        // Left corner fountain
        particles.push({
          x: 0,
          y: height - 50,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 8 + 4,
          speedY: -(Math.random() * 12 + 6),
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 5 - 2.5,
          opacity: 1
        });
        // Right corner fountain
        particles.push({
          x: width,
          y: height - 50,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: -(Math.random() * 8 + 4),
          speedY: -(Math.random() * 12 + 6),
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 5 - 2.5,
          opacity: 1
        });
      }
    };

    spawnFountains();

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      let alive = false;
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.speedY += 0.12; // Gravity
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.opacity -= 0.05;
        }

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          
          // Draw rectangles and stars
          if (Math.random() > 0.5) {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          } else {
            // Circle or custom shape
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (alive && frame < 180) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      id="spark-confetti"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
