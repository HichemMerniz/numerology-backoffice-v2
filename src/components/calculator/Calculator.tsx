import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { NumerologyResults } from "../numerology/NumerologyResults";
import { format } from "date-fns";
import { CheckCircle2, AlertCircle } from "lucide-react";

type CalculatorFormData = {
  firstName: string;
  lastName: string;
  dob: string;
};

type NameAnalysis = {
  letters: string[];
  values: number[];
  consonants: number[];
  vowels: number[];
  total: number;
  consonantSum: number;
  vowelSum: number;
};

type CalculatorResults = {
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
      lastName: NameAnalysis;
      firstName: NameAnalysis;
      middleNames: NameAnalysis[];
    };
    vibration: number[];
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

  const validateDate = (dateStr: string): boolean => {
    const [day, month, year] = dateStr.split('/').map(Number);
    
    // Check if all parts are numbers
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    
    // Check ranges
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    // Check days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDate(formData.dob)) {
      return;
    }

    setIsCalculating(true);

    try {
      // TODO: Replace with actual API call
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResults({
        name: `${formData.firstName} ${formData.lastName}`,
        dob: format(new Date(formData.dob.split('/').reverse().join('-')), "PPP"),
        readings: {
          resultId: "1750930596234",
          lifePath: {
            name: "Life Path",
            value: 6,
            pillar: 4,
            inclusion: 0,
          },
          expression: {
            name: "Expression",
            value: 5,
            pillar: "N/A",
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
            value: 13,
            pillar: 1,
            inclusion: 1,
          },
          health: 1,
          sentiment: 0,
          heredityNumber: {
            value: 4,
            description: "Héritage de stabilité et de tradition",
            pillar: 2,
            inclusion: 1,
          },
          karmicDebts: [],
          inclusionGrid: {
            grid: {
              "1": 0,
              "2": 0,
              "3": 1,
              "4": 2,
              "5": 3,
              "6": 0,
              "7": 0,
              "8": 3,
              "9": 3
            },
            pillars: {
              physical: [4, 5, 6],
              emotional: [2, 3, 6],
              mental: [1, 7, 8],
              intuitive: [3, 7, 9]
            },
            legend: [
              "Physical: Fort",
              "Emotional: Faible",
              "Mental: Modéré",
              "Intuitive: Modéré"
            ],
            total: 12
          },
          letterAnalysis: {
            vowels: [
              { letter: "E", value: 5, count: 2 },
              { letter: "I", value: 9, count: 2 }
            ],
            consonants: [
              { letter: "M", value: 4, count: 2 },
              { letter: "R", value: 9, count: 1 },
              { letter: "N", value: 5, count: 1 },
              { letter: "Z", value: 8, count: 1 },
              { letter: "H", value: 8, count: 2 },
              { letter: "C", value: 3, count: 1 }
            ],
            totalVowels: 4,
            totalConsonants: 8,
            interpretation: "Équilibre entre émotion et raison"
          },
          cycles: {
            formatif: { number: 5, years: "0-31" },
            productif: { number: 1, years: "32-58" },
            moisson: { number: 9, years: "59+" }
          },
          realizations: {
            premier: 3,
            deuxième: 3,
            troisième: 3,
            quatrième: 3
          },
          challenges: {
            premierMinor: 4,
            deuxièmeMinor: 8,
            major: 4
          },
          personalityTraits: {
            intimate: "H",
            social: "M"
          },
          nameAnalysis: {
            lastName: {
              letters: ["M", "E", "R", "N", "I", "Z"],
              values: [4, 5, 9, 5, 9, 8],
              consonants: [4, 0, 9, 5, 0, 8],
              vowels: [0, 5, 0, 0, 9, 0],
              total: 4,
              consonantSum: 8,
              vowelSum: 5
            },
            firstName: {
              letters: ["H", "I", "C", "H", "E", "M"],
              values: [8, 9, 3, 8, 5, 4],
              consonants: [8, 0, 3, 8, 0, 4],
              vowels: [0, 9, 0, 0, 5, 0],
              total: 1,
              consonantSum: 5,
              vowelSum: 5
            },
            middleNames: [{
              letters: [],
              values: [],
              consonants: [],
              vowels: [],
              total: 0,
              consonantSum: 0,
              vowelSum: 0
            }]
          },
          vibration: [1, 2, 11, 20, 3, 4, 13, 22, 5, 6, 33, 7, 8, 9]
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('calculator.title')}</CardTitle>
        <CardDescription>{t('calculator.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="relative">
              <Input
                id="dob"
                type="text"
                placeholder="JJ/MM/AAAA"
                value={formData.dob}
                onChange={(e) => {
                  const value = e.target.value;
                  // Remove any non-digit characters
                  const digits = value.replace(/\D/g, '');
                  
                  // Format as DD/MM/YYYY
                  let formattedDate = '';
                  if (digits.length <= 2) formattedDate = digits;
                  else if (digits.length <= 4) formattedDate = `${digits.slice(0, 2)}/${digits.slice(2)}`;
                  else formattedDate = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
                  
                  setFormData(prev => ({ ...prev, dob: formattedDate }));
                }}
                maxLength={10}
                required
                className="pr-8"
              />
              {formData.dob && validateDate(formData.dob) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </motion.div>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-muted-foreground">
                Format: JJ/MM/AAAA
              </p>
              {formData.dob && !validateDate(formData.dob) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  Date invalide
                </motion.p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? t('calculator.calculating') : t('calculator.button')}
          </Button>
        </form>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <NumerologyResults
              name={results.name}
              dob={results.dob}
              readings={results.readings}
              onGeneratePDF={handleGeneratePDF}
              isGeneratingPDF={isGeneratingPDF}
            />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
} 