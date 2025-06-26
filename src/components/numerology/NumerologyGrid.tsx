import { useLanguage } from "@/context/LanguageContext";

type NumerologyGridProps = {
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
  heredityNumber: {
    value: number;
    description: string;
    pillar: number;
    inclusion: number;
  };
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
};

export function NumerologyGrid({
  lifePath,
  expression,
  intimate,
  realization,
  heredityNumber,
  inclusionGrid,
  letterAnalysis,
}: NumerologyGridProps) {
  const { t } = useLanguage();

  // Convert grid object to array for rendering
  const gridValues = Array.from({ length: 9 }, (_, i) => inclusionGrid.grid[(i + 1).toString()] || 0);

  // Combine vowels and consonants for letter analysis display
  const allLetters = [...letterAnalysis.vowels, ...letterAnalysis.consonants];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4 bg-background rounded-lg shadow-lg">
      {/* Heredity Number - Separate Section */}
      <div className="bg-background p-4 rounded-lg border">
        <div className="text-sm font-medium mb-2">{t('results.heredityNumber')}</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{heredityNumber.value}</span>
          <div className="text-sm space-x-2">
            <span className="text-blue-500">({heredityNumber.pillar})</span>
            <span className="text-red-500">({heredityNumber.inclusion})</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">{heredityNumber.description}</div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{t('results.coreNumbers')}</h2>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Life Path */}
        <div className="bg-background p-4 rounded-lg border">
          <div className="text-sm font-medium mb-2">{lifePath.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{lifePath.value}</span>
            <div className="text-sm space-x-2">
              <span className="text-blue-500">({lifePath.pillar})</span>
              <span className="text-red-500">({lifePath.inclusion})</span>
            </div>
          </div>
        </div>

        {/* Expression */}
        <div className="bg-background p-4 rounded-lg border">
          <div className="text-sm font-medium mb-2">{expression.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{expression.value}</span>
            <div className="text-sm space-x-2">
              <span className="text-blue-500">{expression.pillar}</span>
              <span className="text-red-500">({expression.inclusion})</span>
            </div>
          </div>
        </div>

        {/* Intimate */}
        <div className="bg-background p-4 rounded-lg border">
          <div className="text-sm font-medium mb-2">{intimate.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{intimate.value}</span>
            <div className="text-sm space-x-2">
              <span className="text-blue-500">({intimate.pillar})</span>
              <span className="text-red-500">({intimate.inclusion})</span>
            </div>
          </div>
        </div>

        {/* Realization */}
        <div className="bg-background p-4 rounded-lg border">
          <div className="text-sm font-medium mb-2">{realization.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{realization.value}</span>
            <div className="text-sm space-x-2">
              <span className="text-blue-500">({realization.pillar})</span>
              <span className="text-red-500">({realization.inclusion})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inclusion Grid */}
      <div className="bg-background p-4 rounded-lg border mt-6">
        <h3 className="text-lg font-semibold mb-4">{t('results.inclusionGrid')}</h3>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {gridValues.map((value, index) => (
            <div key={index} className="text-center p-3 bg-muted rounded-lg">
              <span className="text-lg font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <span className="text-sm text-muted-foreground">Total: {inclusionGrid.total}</span>
        </div>
        <div className="mt-4 space-y-2">
          {inclusionGrid.legend.map((text, index) => (
            <div key={index} className="text-sm text-muted-foreground">{text}</div>
          ))}
        </div>
      </div>

      {/* Letter Analysis */}
      <div className="bg-background p-4 rounded-lg border mt-6">
        <h3 className="text-lg font-semibold mb-4">{t('results.letterAnalysis')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {allLetters.map(({ letter, value, count }, index) => (
            <div key={index} className="flex items-center justify-center gap-1 p-2 bg-muted rounded">
              <span className="font-medium">{letter}</span>
              <span className="text-sm text-muted-foreground">({value}×{count})</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-sm text-muted-foreground">
            <div className="font-medium">Voyelles: {letterAnalysis.totalVowels}</div>
            <div className="font-medium">Consonnes: {letterAnalysis.totalConsonants}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            {letterAnalysis.interpretation}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="font-medium">Légende :</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-blue-500">Pilier</span>
            </div>
            <div className="flex items-center">
              <span className="text-red-500">Grille d'inclusion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 