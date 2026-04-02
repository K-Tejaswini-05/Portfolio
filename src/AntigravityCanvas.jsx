import { useEffect, useRef, useMemo } from 'react';

const AntigravityCanvas = ({
  count = 300,
  magnetRadius = 150, // Adjusted for canvas pixels
  ringRadius = 180,
  waveSpeed = 0.05,
  waveAmplitude = 20,
  particleSize = 3,
  lerpSpeed = 0.08,
  color = '#5227FF',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0.002,
  pulseSpeed = 0.03
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const mouse = useRef({ x: -1000, y: -1000 });
  const virtualMouse = useRef({ x: -1000, y: -1000 });
  const lastMouseMoveTime = useRef(0);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      temp.push({
        t: Math.random() * 100,
        speed: 0.01 + Math.random() * 0.02,
        mx: x, // Main position
        my: y,
        cx: x, // Current position
        cy: y,
        randomRadiusOffset: (Math.random() - 0.5) * 40,
        size: 1 + Math.random() * particleSize
      });
    }
    return temp;
  }, [count, particleSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-scatter particles that might be out of bounds
      particles.forEach(p => {
        if (p.mx > canvas.width) p.mx = Math.random() * canvas.width;
        if (p.my > canvas.height) p.my = Math.random() * canvas.height;
      });
    };

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveTime.current = Date.now();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const animate = (time) => {
      const t = time * 0.001;
      
      // Virtual mouse smoothing
      let destX = mouse.current.x;
      let destY = mouse.current.y;

      if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
        destX = canvas.width / 2 + Math.sin(t * 0.5) * (canvas.width / 4);
        destY = canvas.height / 2 + Math.cos(t * 0.5 * 2) * (canvas.height / 4);
      }

      if (virtualMouse.current.x < 0) {
        virtualMouse.current = { x: destX, y: destY };
      } else {
        virtualMouse.current.x += (destX - virtualMouse.current.x) * 0.05;
        virtualMouse.current.y += (destY - virtualMouse.current.y) * 0.05;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6;

      const targetX = virtualMouse.current.x;
      const targetY = virtualMouse.current.y;
      const globalRot = t * rotationSpeed * 100;

      particles.forEach((p) => {
        p.t += p.speed;
        
        const dx = p.mx - targetX;
        const dy = p.my - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let tx = p.mx;
        let ty = p.my;

        if (dist < magnetRadius * 2) {
          const angle = Math.atan2(dy, dx) + globalRot;
          const wave = Math.sin(p.t * waveSpeed * 10 + angle) * waveAmplitude;
          const currentRingRadius = ringRadius + wave + p.randomRadiusOffset;

          tx = targetX + currentRingRadius * Math.cos(angle);
          ty = targetY + currentRingRadius * Math.sin(angle);
        }

        // Particle lerp
        p.cx += (tx - p.cx) * lerpSpeed;
        p.cy += (ty - p.cy) * lerpSpeed;

        // Draw particle (capsule shape)
        const size = p.size * (0.8 + Math.sin(p.t * pulseSpeed * 10) * 0.2 * particleVariance);
        
        ctx.beginPath();
        ctx.save();
        ctx.translate(p.cx, p.cy);
        ctx.rotate(Math.atan2(p.cy - targetY, p.cx - targetX) + Math.PI / 2);
        
        // Capsule-like rect
        ctx.roundRect(-size / 2, -size, size, size * 2.5, size / 2);
        ctx.fill();
        ctx.restore();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [particles, color, magnetRadius, ringRadius, waveSpeed, waveAmplitude, lerpSpeed, autoAnimate, particleVariance, rotationSpeed, pulseSpeed]);

  return <canvas ref={canvasRef} className="bg-canvas-wrapper" style={{ display: 'block' }} />;
};

export default AntigravityCanvas;
