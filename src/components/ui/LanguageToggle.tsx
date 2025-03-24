import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="h-9 w-9 rounded-full"
      title={language === "en" ? "Switch to French" : "Switch to English"}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">
        {language === "en" ? "Switch to French" : "Switch to English"}
      </span>
      <span className="ml-2 text-xs font-medium">{language.toUpperCase()}</span>
    </Button>
  );
} 