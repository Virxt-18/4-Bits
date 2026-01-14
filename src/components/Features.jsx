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

const features = [
  {
    icon: Fingerprint,
    title: "Digital Tourist ID",
    description: "Blockchain-secured digital IDs issued at airports, hotels, and check-posts with integrated KYC verification.",
    highlights: ["Aadhaar/Passport Integration", "Trip-Duration Validity", "Emergency Contacts"],
    color: "primary",
  },
  {
    icon: Smartphone,
    title: "Tourist Mobile App",
    description: "Feature-rich mobile application with safety scoring, geo-fencing, and instant emergency communication.",
    highlights: ["Panic Button", "Live Location Sharing", "Safety Score"],
    color: "secondary",
  },
  {
    icon: Brain,
    title: "AI Anomaly Detection",
    description: "Advanced machine learning algorithms detect unusual patterns and trigger early interventions.",
    highlights: ["Inactivity Detection", "Route Deviation Alerts", "Predictive Analysis"],
    color: "success",
  },
  {
    icon: LayoutDashboard,
    title: "Authority Dashboard",
    description: "Comprehensive command center for real-time monitoring, response coordination, and incident management.",
    highlights: ["Heat Maps", "E-FIR Generation", "Alert Management"],
    color: "primary",
  },
];

const additionalFeatures = [
  { icon: Globe, title: "Multilingual Support", description: "10+ Indian languages + English" },
  { icon: Lock, title: "End-to-End Encryption", description: "Complete data protection compliance" },
  { icon: MapPin, title: "Geo-Fencing", description: "High-risk zone alerts" },
  { icon: AlertTriangle, title: "Distress Detection", description: "Behavioral anomaly flags" },
  { icon: Bell, title: "Instant Alerts", description: "Police & emergency contacts" },
  { icon: FileText, title: "Automated E-FIR", description: "Quick incident reporting" },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
    glow: "shadow-primary/20",
  },
  secondary: {
    bg: "bg-secondary/10",
    border: "border-secondary/20",
    text: "text-secondary",
    glow: "shadow-secondary/20",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/20",
    text: "text-success",
    glow: "shadow-success/20",
  },
};

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-glow opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Shield className="w-4 h-4 text-primary" />
              <span className="block text-sm text-muted-foreground">Core Platform Features</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Complete Safety
            <span className="text-gradient-primary"> Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive, privacy-first system designed to protect tourists while respecting their travel experience.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            return (
              <div
                key={index}
                className="group relative bg-gradient-card rounded-2xl p-6 md:p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 shadow-card hover:shadow-elevated"
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.glow} shadow-2xl blur-xl -z-10`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight, hIndex) => (
                    <span
                      key={hIndex}
                      className={`px-3 py-1.5 rounded-full text-sm ${colors.bg} ${colors.text} border ${colors.border}`}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} rounded-bl-3xl rounded-tr-2xl opacity-50`} />
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
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-medium text-sm text-foreground mb-1">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
