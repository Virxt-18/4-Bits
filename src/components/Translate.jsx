import { useState } from "react"
import { Globe, ChevronUp } from "lucide-react"

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "bt", name: "Bhutia", nativeName: "Bhutia" },
  { code: "bo", name: "Bodo", nativeName: "बड़ो" },
  { code: "ks", name: "Khasi", nativeName: "Khasi" },
  { code: "ko", name: "Kokborok", nativeName: "Kokborok" },
  { code: "me", name: "Meitei", nativeName: "Manipuri" },
  { code: "mi", name: "Mizo", nativeName: "Mizo" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" }
]

export default function Translate({ language, changeLanguage }) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLang = languages.find(lang => lang.code === language)

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white dark:bg-gray-900 border-2 border-blue-500 rounded-xl shadow-2xl p-3 w-56 max-h-105 overflow-y-auto z-10000">
          <div className="mb-2 pb-2 border-b border-gray-300 dark:border-gray-700">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 px-2">Select Language</p>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all mb-1 ${
                language === lang.code
                  ? "bg-blue-500 text-white font-semibold shadow-md scale-105"
                  : "text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
            >
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs ml-2 opacity-70">({lang.name})</span>
            </button>
          ))}
        </div>
      )}
      {currentLang && (
        <div className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full shadow-md font-semibold">
          {currentLang.nativeName}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-xl transition-all hover:scale-110 active:scale-95"
        title="Change Language"
      >
        <Globe size={20} />
        {isOpen ? <span className="text-lg">−</span> : <ChevronUp size={16} />}
      </button>
    </div>
  )
}