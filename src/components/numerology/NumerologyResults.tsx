import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { NumerologyGrid } from "./NumerologyGrid";

type NumerologyResultsProps = {
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
  onGeneratePDF?: () => void;
  isGeneratingPDF?: boolean;
};

export function NumerologyResults({
  name,
  dob,
  readings,
  onGeneratePDF,
  isGeneratingPDF,
}: NumerologyResultsProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-card/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{t('results.title')}</CardTitle>
              <CardDescription className="mt-2">
                {name} • {dob}
              </CardDescription>
            </div>
            {onGeneratePDF && (
              <Button
                onClick={onGeneratePDF}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isGeneratingPDF}
              >
                <Download className={`h-4 w-4 ${isGeneratingPDF ? 'animate-spin' : ''}`} />
                {t('results.generateReport')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Core Numbers Grid */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('results.coreNumbers')}</h3>
              <NumerologyGrid
                lifePath={readings.lifePath}
                expression={readings.expression}
                intimate={readings.intimate}
                realization={readings.realization}
              />
            </div>

            {/* Additional sections can be added here */}
            {/* For example: Life Cycles, Challenges, etc. */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 