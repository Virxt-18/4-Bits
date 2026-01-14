
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Loading from "./Loading";
import Translate from "../components/Translate";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n.js";


const Home = () => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(i18n.language);

  console.log(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)   // Change react-i18next language
    setLanguage(lang)           // Update state
  };

  return (
    <>
      <Loading onFinish={() => setIsLoading(false)} />
      <div className="min-h-screen min-w-screen overflow-x-hidden">
        <Header />
        <main>
          <Hero />
          <Features />
        </main>
        <Footer />
        {!isLoading && <Translate language={language} changeLanguage={changeLanguage} />}
      </div>
    </>
  );
};

export default Home;
