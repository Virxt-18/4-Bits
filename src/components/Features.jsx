import { 
  Fingerprint, 
  Smartphone, 
  Brain, 
  LayoutDashboard, 
  Globe, 
  Lock,
  MapPin,
  AlertTriangle,
  Bell,
  FileText,
  Radio,
  Shield
} from "lucide-react";
import { useTranslation } from "react-i18next"

const features = [
  {
    icon: Fingerprint,
    title: "id",
    description: "idtext",
    highlights: ["idaadhaar","idtrip","idemergency"],
    color: "rgba(255, 151, 0,0.90)",
    shadowColor: "rgba(255, 151, 0,0.40)"
  },
  {
    icon: Smartphone,
    title: "twa",
    description: "twatext",
    highlights: ["pb","lls","ss"],
    color: "rgba(51, 102, 255,0.90)",
    shadowColor: "rgba(51, 102, 255,0.40)"
  },
  {
    icon: Brain,
    title: "anamoly",
    description: "anamolytext" ,
    highlights: ["anamolyid","anamolyrda","anamolypa"],
    color: "rgba(255, 247, 59, 0.90)",
    shadowColor: "rgba(255, 247, 59, 0.40)"
  },
  {
    icon: LayoutDashboard,
    title: "ad",
    description: "adtext",
    highlights: ["adhm", "adefir", "adam"],
    color: "rgba(112, 251, 255,0.90)",
    shadowColor: "rgba(112, 251, 255,0.40)"
  },
];

const additionalFeatures = [
  { icon: Globe, title: "ms", description: "mstext", color: "rgba(51, 102, 255,0.90)" },
  { icon: Lock, title: "eee", description: "eeetext", color: "rgba(18, 211, 166,0.90)" },
  { icon: MapPin, title: "gf", description: "gftext", color: "rgba(147, 238, 72,0.90)" },
  { icon: AlertTriangle, title: "dd", description: "ddtext", color: "rgba(255, 0, 50,0.90)" },
  { icon: Bell, title: "ia", description: "iatext", color: "rgba(172, 112, 254,0.90)" },
  { icon: FileText, title: "aefir", description: "aefirtext", color: "rgba(255, 151, 0,0.90)" },
];

const Features = () => {
  const { t } = useTranslation();
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-glow opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(18,211,166,0.5)] mb-6">
            <Shield className="w-4 h-4 text-primary" />
              <span className="block text-sm text-muted-foreground">{t("cpf")}</span>
          </div>
          <h2 className="text-gradient text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("cfe")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("cfetext")}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="group relative bg-gradient-card rounded-2xl p-6 md:p-8 border border-border/50 transition-all duration-200 border-(--card-color) hover:-translate-y-1 hover:bg-(--shadow-color)"
                style={{
                  '--card-color': feature.color,
                  '--shadow-color': feature.shadowColor
                }}
              >
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl  border border-(--card-color) bg-(--shadow-color)  flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 text-white`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-foreground">
                  {t(feature.title)}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t(feature.description)}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight, hIndex) => (
                    <span
                      key={hIndex}
                      className={`px-3 py-1.5 rounded-full border-(--card-color) text-sm border`}
                    >
                      {t(highlight)}
                    </span>
                  ))}
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-3xl rounded-tr-2xl opacity-50`} />
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="group glass rounded-xl p-4 text-center hover:bg-primary/5 transition-all duration-300 cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <feature.icon className="w-5 h-5 text-(--card-color)"
                style={{
                  '--card-color': feature.color
                }}/>
              </div>
              <h4 className="font-medium text-sm text-foreground mb-1">{t(feature.title)}</h4>
              <p className="text-xs text-muted-foreground">{t(feature.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;