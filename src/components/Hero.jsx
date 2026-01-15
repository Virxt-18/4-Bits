import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Fingerprint, MapPin, Bell, Lock, Globe, LayoutDashboard, Users, Database, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"

gsap.registerPlugin(ScrollTrigger);

const languages = [
  "English", "हिन्दी", "অসমীয়া", "মণিপুরী", "नागामी", "मिज़ो", "Khasi", "त्रिपुरी", "Arunachali", "सिक्किमी", "বাংলা", "नेपाली"
];

const states = [
  "Assam", "Meghalaya", "Manipur", "Nagaland", "Tripura", "Mizoram", "Arunachal Pradesh", "Sikkim"
];

const FEATURES = [
  { icon: MapPin, info: "rtt", color: "rgba(147, 238, 72,0.90)", shadow_color: "rgba(147, 238, 72,0.40)" },
  { icon: Bell, info: "isr", color: "rgba(255, 0, 50,0.90)", shadow_color: "rgba(255, 0, 50,0.40)" },
  { icon: Lock, info: "pfd", color: "rgba(18, 211, 166,0.90)", shadow_color: "rgba(18, 211, 166,0.40)" },
  {icon: Brain, info: "ism", color: "rgba(255, 247, 59, 0.90)", shadow_color: "rgba(255, 247, 59, 0.40)"},
  {icon: Database, info: "dim", color: "rgba(172, 112, 254,0.90)", shadow_color: "rgba(172, 112, 254,0.40)"},
  { icon: Globe, info: "10ll", color: "rgba(51, 102, 255,0.90)", shadow_color: "rgba(51, 102, 255,0.40)" },
  { icon: Fingerprint, info: "dti", color: "rgba(255, 151, 0,0.90)", shadow_color: "rgba(255, 151, 0,0.40)" },
  { icon: LayoutDashboard, info: "ade", color: "rgba(112, 251, 255,0.90)", shadow_color: "rgba(112, 251, 255,0.40)" }
];

export default function Hero() {

  const { t } = useTranslation();

  const bgLayerRef = useRef(null);
  const desktopContentRef = useRef(null);
  const mobileContentRef = useRef(null);

  useEffect(() => {
    // Background zoom ONLY (does not affect layout)
    if (desktopContentRef.current && bgLayerRef.current) {
      gsap.to(
        bgLayerRef.current,
        {
          scale: 1.15,
          ease: "power2.out",
          transformOrigin: "center center",
          scrollTrigger: {
            trigger: desktopContentRef.current,
            start: "top top",
            end: "+=400",
            scrub: true,
          }
        }
      );

      // Content float upward (transform-only, no reflow)
      gsap.to(
        desktopContentRef.current,
        {
          y: -120,
          ease: "power2.out",
          scrollTrigger: {
            trigger: desktopContentRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <div ref={bgLayerRef} className="hero-bg w-screen h-screen relative
              bg-[url('images/bg.jpg')]
              bg-cover
              bg-no-repeat bg-bottom
              overflow-hidden flex items-center justify-center
              bg-[rgba(2,16,42,1)]">
        
        <div class="absolute w-[clamp(200px,40vw,1600px)] h-[clamp(200px,40vw,1600px)] rounded-full pulse-glow
    bg-[radial-gradient(circle,rgba(0,200,255,0.2)_0%,rgba(0,200,255,0.1)_30%,transparent_70%)] opacity-30">
        </div>
        <div ref={desktopContentRef} className="hero-content relative max-md:hidden perspective w-full h-full flex items-center justify-center">
          
          <div className="tilt relative w-full h-full flex items-center justify-center">
            <div className="absolute no-tilt z-10 top-60 overflow-hidden pointer-events-none select-none text-white text-[clamp(45px,7vw,70px)] flex justify-around items-center font-bold px-8 flex-col rounded-3xl scale-95 text-center leading-25">
              <div className="bg-[rgba(8,12,22,0.9)] shadow-[0_0_15px_rgba(38,92,217,0.5)] rounded-xl px-4 border border-[rgba(18,211,166,0.5)]"><p className="text-gradient nb tracking-wide">{t("tripshield")}</p></div>
              <div>{t("travelsafely")}</div>
            </div>
            
            
            {/* Carousel ring */}
            <div className="carousel animate-rotate relative w-full h-full">
              {FEATURES.map((item, i) => (
                <div
                  key={i}
                  className="card w-28 h-30 max-[1000px]:w-22 max-[1000px]:h-24 max-[1000px]:px-1 px-2 flex flex-col items-center justify-center absolute top-1/2 left-1/2 hover:scale-105 max-[1000px]:scale-103 transition duration-200 cursor-pointer shadow-[0_0_10px_rgba(255,255,255,.10)] hover:shadow-[0_0_30px_var(--shadow-color)] border border-(--shadow-color) hover:border-(--card-color)"
                  style={{
                    transform: `  
                      rotateY(${i * (360 / FEATURES.length)}deg) 
                      translateZ(clamp(120px, 30vw, 350px)) 
                      translateX(-50%) 
                      translateY(-50%)
                    `,
                    transformOrigin: 'center center',
                    '--card-color': item.color,
                    '--shadow-color': item.shadow_color,
                  }}
                >
                  <item.icon className="w-14 h-14 max-[1000px]:w-10 max-[1000px]:h-10 text-(--card-color)" /><p className="mt-1 text-[0.8rem] max-[1000px]:text-[0.6rem] text-center font-bold text-white">{t(item.info)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div ref={mobileContentRef} className="hero-content relative hidden max-md:flex flex-col w-full h-full items-center pt-30">
          <div className="flex flex-col items-center text-[clamp(30px,5vw,60px)] mb-3">
            <div className="bg-[rgba(8,12,22,0.9)] shadow-[0_0_15px_rgba(38,92,217,0.5)] rounded-xl px-4 border border-[rgba(18,211,166,0.5)]"><p className="text-gradient nb tracking-wide">{t("tripshield")}</p></div>
              <div className="text-shadow-[2px_2px_10px_rgba(0,0,0,.6)]">{t("travelsafely")}</div>
          </div>
          <div className="flex flex-wrap gap-2 px-5 mt-6 max-[510px]:mt-2 ">
  {FEATURES.map((item, i) => (
    <div
      key={i}
      className="flex items-center gap-2 flex-1 p-2 rounded-xl border border-(--card-color) bg-(--shadow-color)"
    style={{
          '--card-color': item.color,
          '--shadow-color': item.shadow_color,
                  }}>
      <item.icon className="w-5 h-5 text-shadow-[1px_1px_4px_rgba(0,0,0,.6)]" />
      <span className="font-medium text-nowrap text-shadow-[1px_1px_4px_rgba(0,0,0,.6)] text-[16px] max-[415px]:text-[11px] max-[372px]:text-[11px]">{t(item.info)}</span>
    </div>
  ))}
</div>
        </div>
      </div>
      <div className="hero-content w-auto max-[420px]:w-screen absolute bottom-1 min-[450px]:bottom-8 h-37  -translate-x-1/2 left-1/2 flex flex-col" style={{opacity: 1, visibility: 'visible'}}>
        <p className="text-[clamp(17px,4vw,40px)] text-center font-bold text-shadow-[2px_2px_10px_rgba(0,0,0,.6)]">
          {t("safe")}
        </p>
        <div className="flex items-center justify-between pt-5 max-[320px]:pt-2 px-5 max-[910px]:px-1 max-[800px]:flex-col max-[800px]:gap-3">
          <Link
            to="/register"
            className="group h-12 w-37 relative max-[910px]:h-10 max-[910px]:w-35 overflow-hidden bg-[rgba(8,12,22,0.9)] border border-[rgba(18,211,166,0.5)] text-white px-5 py-2 rounded-full font-semibold active:scale-95 active:opacity-80 hover:bg-white hover:text-[rgba(18,201,211,1)] transition duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-[0_5px_10px_rgba(0,0,0,1)] select-none"
          >
            {/* Top text (default) */}
            <span className="absolute inset-0 flex items-center tracking-wide text-xl justify-center text-white font-medium transition-transform duration-200 group-hover:-translate-y-12">
              {t("reg")}
            </span>

            {/* Bottom text (appears on hover) */}
            <span className="absolute inset-0 flex items-center justify-center text-[rgba(8,12,22,1)] font-medium translate-y-12 transition-transform duration-200 group-hover:translate-y-0">
              <Shield className="w-7 h-7 font-bold"/>
            </span>
          </Link>
          <Link
            to="/authority-login"
            className="group h-12 w-47 max-[910px]:h-10 max-[910px]:w-45  relative overflow-hidden bg-[rgb(251,125,41)] border border-transparent text-white px-5 py-2 rounded-full font-semibold active:scale-95 active:opacity-80 hover:bg-[#15eefa] hover:text-[rgba(18,201,211,1)] transition duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-[0_5px_10px_rgba(0,0,0,1)] select-none"
          >
            {/* Top text (default) */}
            <span className="absolute inset-0 flex items-center tracking-wide text-xl justify-center text-white font-medium transition-transform duration-200 group-hover:-translate-y-12">
              {t("authlogin")}
            </span>

            {/* Bottom text (appears on hover) */}
            <span className="absolute inset-0 flex items-center justify-center text-xl text-[rgba(8,12,22,1)] font-medium translate-y-12 transition-transform duration-200 group-hover:translate-y-0">
              {t("dashboard")}
            </span>
          </Link>
        </div>
      </div>
    </>

  );
}