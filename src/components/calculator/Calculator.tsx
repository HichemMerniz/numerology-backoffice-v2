import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { NumerologyResults } from "../numerology/NumerologyResults";
import { format } from "date-fns";

type CalculatorFormData = {
  firstName: string;
  lastName: string;
  dob: string;
};

type CalculatorResults = {
  name: string;
  dob: string;
  readings: {
    lifePath: { 
      name: string; 
      value: number;
      pillar: number;
      inclusion: number;
    };
    expression: { 
      name: string; 
      value: string;
      pillar: string;
      inclusion: number;
    };
    intimate: { 
      name: string; 
      value: number;
      pillar: number;
      inclusion: number;
    };
    realization: { 
      name: string; 
      value: string;
      pillar: number;
      inclusion: number;
    };
  };
};

export function Calculator() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CalculatorFormData>({
    firstName: "",
    lastName: "",
    dob: "",
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      // TODO: Replace with actual API call
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResults({
        name: `${formData.firstName} ${formData.lastName}`,
        dob: format(new Date(formData.dob), "PPP"),
        readings: {
          lifePath: {
            name: "Life Path",
            value: 5,
            pillar: 4,
            inclusion: 0,
          },
          expression: {
            name: "Expression",
            value: "####",
            pillar: "#N/A",
            inclusion: 0,
          },
          intimate: {
            name: "Intimate",
            value: 1,
            pillar: 2,
            inclusion: 1,
          },
          realization: {
            name: "Realization",
            value: "2/11",
            pillar: 1,
            inclusion: 1,
          },
        },
      });
    } catch (error) {
      console.error("Error calculating numerology:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!results) return;
    
    setIsGeneratingPDF(true);
    try {
      // TODO: Replace with actual PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Calculator Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('calculator.title')}</CardTitle>
            <CardDescription>{t('calculator.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('calculator.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('calculator.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">{t('calculator.dob')}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isCalculating}
              >
                {isCalculating ? t('calculator.calculating') : t('calculator.button')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {results && (
        <NumerologyResults
          name={results.name}
          dob={results.dob}
          readings={results.readings}
          onGeneratePDF={handleGeneratePDF}
          isGeneratingPDF={isGeneratingPDF}
        />
      )}
    </div>
  );
} 