import React from "react"

export default function Translate({ language, changeLanguage }) {
  return (
    <div className="sticky bottom-0 flex gap-2 z-999">
      <button
        onClick={() => changeLanguage("en")}
        className={language === "en" ? "font-bold" : ""}
      >
        English
      </button>

      <button
        onClick={() => changeLanguage("hi")}
        className={language === "hi" ? "font-bold" : ""}
      >
        हिंदी
      </button>

      <button
        onClick={() => changeLanguage("fr")}
        className={language === "fr" ? "font-bold" : ""}
      >
        Français
      </button>
    </div>
  )
}
