import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next"

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer id="contact" className="bg-gradient-card overflow-hidden border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
                <img src="images/Logo.png" className="h-8 max-[900px]:h-6" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-gradient">{t("tripshield")}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("ftext")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("ql")}</h4>
            <ul className="space-y-3">
              {["Tourist Registration", "Authority Portal", "Safety Guidelines", "Emergency Contacts"].map((link, index) => (
                <li key={index}>
                  <a href="#" className="link text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("res")}</h4>
            <ul className="space-y-3">
              {["Travel Advisories", "Regional Maps", "FAQ", "Privacy Policy"].map((link, index) => (
                <li key={index}>
                  <a href="#" className="link text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t("ql")}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("ec24")}</p>
                  <p className="font-semibold text-foreground">{t("ecno")}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                <p className="text-xs text-muted-foreground">{t("ecse")}</p>
                  <p className="font-semibold text-foreground">{t("ecmail")}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("echq")}</p>
                  <p className="font-semibold text-foreground">{t("ecaddress")}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t("cr")}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="link text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("tos")}
            </a>
            <a href="#" className="link text-sm text-muted-foreground hover:text-primary transition-colors">
             {t("dp")}
            </a>
            <a href="#" className="link text-sm text-muted-foreground hover:text-primary transition-colors">
             {t("acc")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;