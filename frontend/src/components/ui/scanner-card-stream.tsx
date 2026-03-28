'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatedIDCard, AnimatedIDType } from './animated-id-card';

const cardTypes: AnimatedIDType[] = ['aadhar', 'pan', 'driving', 'certificate'];

// --- Helper function to generate ASCII-like code ---
const ASCII_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";
const generateCode = (width: number, height: number): string => {
  let text = "";
  for (let i = 0; i < width * height; i++) {
    text += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
  }
  let out = "";
  for (let i = 0; i < height; i++) {
    out += text.substring(i * width, (i + 1) * width) + "\n";
  }
  return out;
};

// --- Component Props Type Definition ---
type ScannerCardStreamProps = {
  initialSpeed?: number;
  direction?: -1 | 1;
  cardTypesConfig?: string[];
  repeat?: number;
  cardGap?: number;
  friction?: number;
  scanEffect?: 'clip' | 'scramble';
};

// --- The Main Component ---
const ScannerCardStream = ({
  initialSpeed = 150,
  direction = -1,
  cardTypesConfig = cardTypes,
  repeat = 6,
  cardGap = 60,
  friction = 0.95,
  scanEffect = 'scramble',
}: ScannerCardStreamProps) => {

  const [isPaused] = useState(false);
  const [isScanning, setIsScanning] = useState(false); 
  
  const cards = useMemo(() => {
    const totalCards = cardTypesConfig.length * repeat;
    return Array.from({ length: totalCards }, (_, i) => ({
      id: i,
      type: cardTypesConfig[i % cardTypesConfig.length],
      ascii: generateCode(Math.floor(400 / 6.5), Math.floor(250 / 13)),
    }))
  }, [cardTypesConfig, repeat]);

  const cardLineRef = useRef<HTMLDivElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalAscii = useRef(new Map<number, string>());

  const cardStreamState = useRef({
    position: 0, velocity: initialSpeed, direction: direction, isDragging: false,
    lastMouseX: 0, lastTime: performance.now(), cardLineWidth: (400 + cardGap) * cards.length,
    friction: friction, minVelocity: 30,
  });

  const scannerState = useRef({ isScanning: false });
  
  useEffect(() => {
    const cardLine = cardLineRef.current;
    const scannerCanvas = scannerCanvasRef.current;

    if (!cardLine || !scannerCanvas) return;
    
    cards.forEach(card => originalAscii.current.set(card.id, card.ascii));
    let animationFrameId: number;

    const ctx = scannerCanvas.getContext('2d')!;
    scannerCanvas.width = window.innerWidth;
    scannerCanvas.height = 300;
    let scannerParticles: any[] = [];
    const baseMaxParticles = 800;
    let currentMaxParticles = baseMaxParticles;
    const scanTargetMaxParticles = 2500;
    const createScannerParticle = () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 3, y: Math.random() * 300, vx: Math.random() * 0.8 + 0.2, vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.6 + 0.4, alpha: Math.random() * 0.4 + 0.6, life: 1.0, decay: Math.random() * 0.02 + 0.005,
    });
    for (let i = 0; i < baseMaxParticles; i++) scannerParticles.push(createScannerParticle());
    
    const updateCardEffects = () => {
      const scannerX = window.innerWidth / 2;
      const scannerWidth = 4;
      const scannerLeft = scannerX - scannerWidth / 2;
      const scannerRight = scannerX + scannerWidth / 2;
      let anyCardIsScanning = false;
      cardLine.querySelectorAll<HTMLElement>(".card-wrapper").forEach((wrapper) => {
        const rect = wrapper.getBoundingClientRect();
        const normalCard = wrapper.querySelector<HTMLElement>(".card-normal")!;
        const encryptedCard = wrapper.querySelector<HTMLElement>(".card-encrypted")!;
        
        if (rect.left < scannerRight && rect.right > scannerLeft) {
          anyCardIsScanning = true;
          wrapper.dataset.scanned = 'true';
          const intersectLeft = Math.max(scannerLeft - rect.left, 0);
          const intersectRight = Math.min(scannerRight - rect.left, rect.width);
          
          normalCard.style.setProperty("--clip-right", `${(intersectLeft / rect.width) * 100}%`);
          encryptedCard.style.setProperty("--clip-left", `${(intersectRight / rect.width) * 100}%`);
          wrapper.style.transform = `scale(1.02) translateY(-4px)`;
          wrapper.style.zIndex = "10";
        } else {
          delete wrapper.dataset.scanned;
          wrapper.style.transform = `scale(1) translateY(0)`;
          wrapper.style.zIndex = "1";
          if (rect.right < scannerLeft) {
            normalCard.style.setProperty("--clip-right", "100%");
            encryptedCard.style.setProperty("--clip-left", "100%");
          } else {
            normalCard.style.setProperty("--clip-right", "0%");
            encryptedCard.style.setProperty("--clip-left", "0%");
          }
        }
      });
      setIsScanning(anyCardIsScanning);
      scannerState.current.isScanning = anyCardIsScanning;
    };
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - cardStreamState.current.lastTime) / 1000;
      cardStreamState.current.lastTime = currentTime;
      if (!isPaused && !cardStreamState.current.isDragging) {
        cardStreamState.current.position += cardStreamState.current.velocity * cardStreamState.current.direction * deltaTime;
      }
      
      const firstCard = cardLine.querySelector<HTMLElement>(".card-wrapper");
      if (firstCard) {
        cardStreamState.current.cardLineWidth = (firstCard.offsetWidth + cardGap) * cards.length;
      }

      const { position, cardLineWidth } = cardStreamState.current;
      const containerWidth = cardLine.parentElement?.offsetWidth || 0;
      if (position < -cardLineWidth) cardStreamState.current.position = containerWidth;
      else if (position > containerWidth) cardStreamState.current.position = -cardLineWidth;
      cardLine.style.transform = `translateX(${cardStreamState.current.position}px)`;
      updateCardEffects();

      ctx.clearRect(0, 0, window.innerWidth, 300);
      const targetCount = scannerState.current.isScanning ? scanTargetMaxParticles : baseMaxParticles;
      currentMaxParticles += (targetCount - currentMaxParticles) * 0.05;
      while (scannerParticles.length < currentMaxParticles) scannerParticles.push(createScannerParticle());
      while (scannerParticles.length > currentMaxParticles) scannerParticles.pop();
      scannerParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0 || p.x > window.innerWidth) Object.assign(p, createScannerParticle());
        ctx.globalAlpha = p.alpha * p.life; ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, cards, cardGap, friction, scanEffect]);

  return (
    <div className="relative w-full h-[320px] lg:h-[400px] flex items-center justify-center overflow-hidden bg-background">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glitch { 0%, 16%, 50%, 100% { opacity: 1; } 15%, 99% { opacity: 0.9; } 49% { opacity: 0.8; } }
        .animate-glitch { animation: glitch 0.1s infinite linear alternate-reverse; }
        @keyframes scanPulse {
          0% { opacity: 0.5; transform: scaleY(1); }
          100% { opacity: 1; transform: scaleY(1.05); }
        }
        .animate-scan-pulse {
          animation: scanPulse 1s infinite alternate ease-in-out;
        }
      `}} />
      <canvas ref={scannerCanvasRef} className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] z-10 pointer-events-none" />
      
      <div
        className={`
          scanner-line absolute top-1/2 left-1/2 h-[280px] w-[3px] -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-b from-transparent via-primary to-transparent rounded-full
          transition-opacity duration-300 z-20 pointer-events-none animate-scan-pulse
          ${isScanning ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          boxShadow: `0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary))`
        }}
      />

      <div className="absolute w-full h-[250px] flex items-center overflow-hidden">
        <div ref={cardLineRef} className="flex items-center whitespace-nowrap will-change-transform" style={{ gap: `${cardGap}px`, paddingLeft: '50vw' }}>
          {cards.map(card => (
            <div key={card.id} className="card-wrapper relative w-[320px] md:w-[380px] h-[210px] md:h-[240px] shrink-0 transition-transform duration-300 ease-out z-1 rounded-[1.5rem]">
              
              {/* NORMAL CARD (Right Side / Unscanned) */}
              <div className="card-normal card absolute top-0 left-0 w-full h-full z-[2] [clip-path:inset(0_0_0_var(--clip-right,0%))] pointer-events-auto rounded-[1.5rem]">
                 <AnimatedIDCard type={card.type as AnimatedIDType} className="!w-full !h-full !max-w-none !rounded-[1.5rem] !m-0 !shadow-none border-border" />
              </div>

              {/* ENCRYPTED CARD (Left Side / Scanned) */}
              <div className="card-encrypted card absolute top-0 left-0 w-full h-full z-[1] [clip-path:inset(0_calc(100%-var(--clip-left,0%))_0_0)] pointer-events-none rounded-[1.5rem]">
                 {/* Underlay keeps the struct intact exactly like the normal card */}
                 <AnimatedIDCard type={card.type as AnimatedIDType} className="!w-full !h-full !max-w-none !rounded-[1.5rem] !m-0 !shadow-none opacity-40 grayscale" />
                 
                 {/* Matrix Green Glowing Overlay that adapts to theme */}
                 <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden bg-background/80 backdrop-blur-[2px] z-[5] flex items-center justify-center p-6">
                    <pre className="w-full h-full text-primary font-mono text-[9px] leading-[11px] md:text-[10px] md:leading-[12px] overflow-hidden whitespace-pre m-0 animate-pulse tracking-widest font-bold opacity-80 delay-150">
                      {card.ascii}
                    </pre>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ScannerCardStream };
