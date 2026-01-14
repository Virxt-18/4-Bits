import { Shield, Menu, X } from "lucide-react";
import { useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const iconRef = useRef(null);
  const tl = useRef(null);

  useLayoutEffect(() => {
  gsap.set(menuRef.current, { autoAlpha: 0 });

  tl.current = gsap.timeline({ paused: true });

  tl.current.to(menuRef.current, {
    y: 0,
    autoAlpha: 1,
    duration: 0.5,
    ease: "power3.out",
  });

  tl.current.fromTo(
    ".mobile-link",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, stagger: 0.08 },
    "-=0.25"
  );

  tl.current.fromTo(
    iconRef.current,
    { rotate: 0 },
    { rotate: 180, duration: 0.35 },
    0
  );
}, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      next ? tl.current.play() : tl.current.reverse();
      return next;
    });
  };

  return (
    <nav className="fixed top-5 w-[clamp(200px,85vw,1400px)] left-1/2 -translate-x-1/2 z-60">
      <div className="flex items-center justify-between h-17 px-5 border border-[rgba(18,198,211,0.5)] rounded-full backdrop-blur-xl bg-black/35 shadow-[0_0_20px_10px_rgba(0,0,0,0.5)] max-[900px]:text-sm select-none">

        <Link to="/">
          <div className="flex items-center gap-3">
            <img src="images/Logo.png" className="h-8 max-[900px]:h-6" />
            <span className="text-gradient nb text-lg md:text-xl">TripShield</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/register"
            className="group h-12 w-40 max-[910px]:h-10 max-[910px]:w-45  relative overflow-hidden bg-linear-to-b from-[#fb7d29] to-[#ff1900] border border-transparent text-white px-5 py-2 rounded-full font-semibold active:scale-95 active:opacity-80 hover:from-[#15eefa] hover:to-[#26f876] hover:text-[rgba(18,201,211,1)] transition duration-200 cursor-pointer select-none"
          >
            <span className="absolute inset-0 flex items-center tracking-wide text-xl justify-center text-white font-medium transition-transform duration-200 group-hover:-translate-y-12">
              Get Started
            </span>

            <span className="absolute inset-0 flex items-center justify-center text-xl text-[rgba(8,12,22,1)] font-semibold translate-y-12 tracking-wide transition-transform duration-200 group-hover:translate-y-0">
              Register
            </span>
          </Link>
        </div>

        {/* Mobile Button (animated icon) */}
        <button className="md:hidden p-2" onClick={toggleMenu}>
          <div ref={iconRef}>
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </div>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        ref={menuRef}
        className="md:hidden fixed top-0 left-0 w-full h-screen bg-[#04070f] border-b border-cyan-400/40 flex flex-col items-center justify-center gap-6 z-99 opacity-0"
      >
        <a className="mobile-link text-xl" href="#features">Features</a>
        <a className="mobile-link text-xl" href="#how-it-works">How It Works</a>
        <a className="mobile-link text-xl" href="#contact">Contact</a>

        <button className="mobile-link px-4 py-2">Authority Login</button>
        <button className="mobile-link px-5 py-2 bg-primary rounded-xl">
          Get Started
        </button>
      </div>
    </nav>
  )
}
export default Header