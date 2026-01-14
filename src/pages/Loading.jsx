import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Shield } from "lucide-react";

export default function Loading({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const overlayRef = useRef(null);

  useEffect(() => {
    // Lock scroll
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    const img = new Image();
    img.src = "/images/bg.jpg";

    img.onload = () => {
      gsap.to({}, {
        duration: 2,
        onUpdate() {
          setProgress(this.progress() * 100);
        },
        onComplete: () => {
          // Animate overlay out
          gsap.to(overlayRef.current, {
            y: "-100%",
            duration: 1,
            ease: "power3.inOut",
            onComplete: () => {
              // Unlock scroll
              document.body.style.position = "";
              document.body.style.top = "";
              window.scrollTo(0, scrollY); // restore scroll
              if (onFinish) onFinish();
            }
          });
        }
      });
    };

    return () => {
      // Cleanup
      document.body.style.position = "";
      document.body.style.top = "";
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
