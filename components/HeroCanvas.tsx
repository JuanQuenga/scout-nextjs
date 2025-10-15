"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  opacity: number;
  size: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles
    const createParticle = (x?: number, y?: number): Particle => {
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: Math.random() * 200 + 100,
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 2 + 1,
      };
    };

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }

    // Draw light rays
    const drawLightRays = (time: number) => {
      // Main radial light source from right side
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.85,
        canvas.height * 0.5,
        0,
        canvas.width * 0.85,
        canvas.height * 0.5,
        canvas.width * 0.8
      );

      gradient.addColorStop(0, "rgba(255, 255, 255, 0.25)");
      gradient.addColorStop(0.2, "rgba(147, 197, 253, 0.15)");
      gradient.addColorStop(0.4, "rgba(59, 130, 246, 0.08)");
      gradient.addColorStop(0.7, "rgba(30, 58, 138, 0.03)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Horizontal light beam
      ctx.save();
      const beamGradient = ctx.createLinearGradient(
        canvas.width * 0.5,
        0,
        canvas.width,
        0
      );
      beamGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      beamGradient.addColorStop(0.5, "rgba(147, 197, 253, 0.1)");
      beamGradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");

      ctx.fillStyle = beamGradient;
      ctx.fillRect(0, canvas.height * 0.3, canvas.width, canvas.height * 0.4);
      ctx.restore();

      // Animated diagonal light streaks
      ctx.save();
      ctx.globalAlpha = 0.08 + Math.sin(time * 0.001) * 0.03;
      ctx.translate(canvas.width * 0.85, canvas.height * 0.5);

      for (let i = 0; i < 12; i++) {
        const angle = ((Math.PI * 2) / 12) * i + time * 0.0001;
        ctx.save();
        ctx.rotate(angle);

        const streakGradient = ctx.createLinearGradient(
          0,
          -canvas.height,
          0,
          canvas.height
        );
        streakGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        streakGradient.addColorStop(0.3, "rgba(255, 255, 255, 0)");
        streakGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.6)");
        streakGradient.addColorStop(0.7, "rgba(147, 197, 253, 0.3)");
        streakGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = streakGradient;
        ctx.fillRect(-30, -canvas.height, 60, canvas.height * 2);
        ctx.restore();
      }

      ctx.restore();
    };

    // Draw glowing orbs
    const drawGlowingOrbs = () => {
      // Top left orb
      const orb1 = ctx.createRadialGradient(
        canvas.width * 0.2,
        canvas.height * 0.3,
        0,
        canvas.width * 0.2,
        canvas.height * 0.3,
        200
      );
      orb1.addColorStop(0, "rgba(59, 130, 246, 0.3)");
      orb1.addColorStop(0.5, "rgba(59, 130, 246, 0.1)");
      orb1.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bottom right orb
      const orb2 = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.7,
        0,
        canvas.width * 0.7,
        canvas.height * 0.7,
        150
      );
      orb2.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      orb2.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
      orb2.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Animate particles
    const animateParticles = () => {
      particles.forEach((particle, index) => {
        particle.life++;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Fade in and out
        const lifeFraction = particle.life / particle.maxLife;
        let alpha = particle.opacity;
        if (lifeFraction < 0.1) {
          alpha *= lifeFraction / 0.1;
        } else if (lifeFraction > 0.9) {
          alpha *= (1 - lifeFraction) / 0.1;
        }

        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = alpha;

        // Outer glow
        const glow = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4
        );
        glow.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        glow.addColorStop(0.5, "rgba(147, 197, 253, 0.4)");
        glow.addColorStop(1, "rgba(147, 197, 253, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Reset particle if dead or out of bounds
        if (
          particle.life > particle.maxLife ||
          particle.x < -50 ||
          particle.x > canvas.width + 50 ||
          particle.y < -50 ||
          particle.y > canvas.height + 50
        ) {
          particles[index] = createParticle();
        }
      });
    };

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Add particles near mouse occasionally
      if (Math.random() < 0.1) {
        particles.push(
          createParticle(
            mouseX + (Math.random() - 0.5) * 100,
            mouseY + (Math.random() - 0.5) * 100
          )
        );

        // Limit particles
        if (particles.length > 100) {
          particles.shift();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      const currentTime = Date.now() - startTime;

      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawLightRays(currentTime);
      drawGlowingOrbs();
      animateParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.8 }}
    />
  );
}
