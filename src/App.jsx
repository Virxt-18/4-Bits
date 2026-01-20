import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuthorityLogin from "./pages/AuthorityLogin";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import NotFound from "./pages/NotFound";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useTranslation } from "react-i18next";
import Translate from "./components/Translate";
import Loading from "./pages/Loading";
import "./i18n.js";

export const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

function App() {

  const { i18n } = useTranslation();
  const lenisRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)   // Change react-i18next language
    setLanguage(lang)      
    localStorage.setItem("lang", lang)
  };

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    let animationFrameId;
    const raf = (time) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);
  console.log(isLoading);
  return (
    <BrowserRouter>
    {isLoading && <Loading onFinish={() => setIsLoading(false)} />}
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicRoute>
            <Home />
          </PublicRoute>} />
        <Route path="/register" element={<PublicRoute>
            <Register />
          </PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
        <Route path="/authority-login" element={<AuthorityLogin />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
    <Translate language={language} changeLanguage={changeLanguage} />
    </BrowserRouter>
  );

}

export default App;