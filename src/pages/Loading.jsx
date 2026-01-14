import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Shield } from "lucide-react";

export default function Loading({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const overlayRef = useRef(null);

  useEffect(() => {
    // Don't lock scroll, just disable scrolling with overflow
    document.body.style.overflow = "hidden";

    const startExit = () => {
      gsap.to(overlayRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.6,
        delay: 0.15,
        ease: "power2.inOut",
        onComplete: () => {
          document.body.style.overflow = "";
          if (onFinish) onFinish();
        }
      });
    };

    const runProgress = () => {
      gsap.to({}, {
        duration: 1.1,
        onUpdate() {
          setProgress(this.progress() * 100);
        },
        onComplete: startExit
      });
    };

    const img = new Image();
    img.src = "/images/bg.jpg";

    let timeoutId = setTimeout(runProgress, 1200); // fallback if image is slow

    img.onload = () => {
      clearTimeout(timeoutId);
      runProgress();
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      runProgress();
    };

    return () => {
      // Cleanup
      document.body.style.overflow = "";
    };
  }, [onFinish]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center
                 bg-[#080c16]"
    >
      {/* 🛡 Shield Loader */}
      <div className="relative w-32 h-32">
        <Shield className="w-full h-full text-white" />
        <div
          className="absolute bottom-0 left-0 w-full bg-cyan-400"
          style={{
            height: `${progress}%`,
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            transition: "height .1s linear"
          }}
        />
      </div>

      <p className="mt-6 text-white text-xl font-bold">
        Loading… {Math.round(progress)}%
      </p>
    </div>
  );
}
