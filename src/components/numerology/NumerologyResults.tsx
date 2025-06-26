import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import {NumerologyGrid} from "./NumerologyGrid";

type NumerologyResultsProps = {
  name: string;
  dob: string;
  readings: {
    resultId: string;
    lifePath: { 
      name: string; 
      value: number;
      pillar: number;
      inclusion: number;
    };
    expression: { 
      name: string; 
      value: number;
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
      value: number;
      pillar: number;
      inclusion: number;
    };
    health: number;
    sentiment: number;
    heredityNumber: {
      value: number;
      description: string;
      pillar: number;
      inclusion: number;
    };
    karmicDebts: number[];
    inclusionGrid: {
      grid: {
        [key: string]: number;
      };
      pillars: {
        physical: number[];
        emotional: number[];
        mental: number[];
        intuitive: number[];
      };
      legend: string[];
      total: number;
    };
    letterAnalysis: {
      vowels: Array<{
        letter: string;
        value: number;
        count: number;
      }>;
      consonants: Array<{
        letter: string;
        value: number;
        count: number;
      }>;
      totalVowels: number;
      totalConsonants: number;
      interpretation: string;
    };
    cycles: {
      formatif: {
        number: number;
        years: string;
      };
      productif: {
        number: number;
        years: string;
      };
      moisson: {
        number: number;
        years: string;
      };
    };
    realizations: {
      premier: number;
      deuxième: number;
      troisième: number;
      quatrième: number;
    };
    challenges: {
      premierMinor: number;
      deuxièmeMinor: number;
      major: number;
    };
    personalityTraits: {
      intimate: string;
      social: string;
    };
    nameAnalysis: {
      lastName: {
        letters: string[];
        values: number[];
        consonants: number[];
        vowels: number[];
        total: number;
        consonantSum: number;
        vowelSum: number;
      };
      firstName: {
        letters: string[];
        values: number[];
        consonants: number[];
        vowels: number[];
        total: number;
        consonantSum: number;
        vowelSum: number;
      };
      middleNames: Array<{
        letters: string[];
        values: number[];
        consonants: number[];
        vowels: number[];
        total: number;
        consonantSum: number;
        vowelSum: number;
      }>;
    };
    vibration: number[];
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
          <div className="space-y-8">
            {/* Core Numbers Grid */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('results.coreNumbers')}</h3>
              <NumerologyGrid
                lifePath={readings.lifePath}
                expression={readings.expression}
                intimate={readings.intimate}
                realization={readings.realization}
                heredityNumber={readings.heredityNumber}
                inclusionGrid={readings.inclusionGrid}
                letterAnalysis={readings.letterAnalysis}
              />
            </div>

            {/* Cycles Section */}
            {readings.cycles && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('results.cycles')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(readings.cycles).map(([cycle, data], index) => (
                    <motion.div
                      key={cycle}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-semibold text-lg mb-2 capitalize text-primary/80">
                        {cycle}
                      </h4>
                      <p className="text-3xl font-bold text-primary mb-1">
                        {data.number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data.years}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges Section */}
            {readings.challenges && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('results.challenges')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: 'premierMinor', label: t('results.firstMinor') },
                    { key: 'deuxièmeMinor', label: t('results.secondMinor') },
                    { key: 'major', label: t('results.major') },
                  ].map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-semibold text-lg mb-2 text-primary/80">
                        {item.label}
                      </h4>
                      <p className="text-3xl font-bold text-primary">
                        {readings.challenges[item.key as keyof typeof readings.challenges]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Realizations Section */}
            {readings.realizations && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('results.realizations')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { key: 'premier', label: t('results.first') },
                    { key: 'deuxième', label: t('results.second') },
                    { key: 'troisième', label: t('results.third') },
                    { key: 'quatrième', label: t('results.fourth') },
                  ].map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-semibold text-lg mb-2 capitalize text-primary/80">
                        {item.label}
                      </h4>
                      <p className="text-3xl font-bold text-primary">
                        {readings.realizations[item.key as keyof typeof readings.realizations]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Personality Traits */}
            {readings.personalityTraits && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('results.personalityTraits')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'intimate', label: t('results.intimate') },
                    { key: 'social', label: t('results.social') },
                  ].map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-semibold text-lg mb-2 capitalize text-primary/80">
                        {item.label}
                      </h4>
                      <p className="text-3xl font-bold text-primary">
                        {readings.personalityTraits[item.key as keyof typeof readings.personalityTraits]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 