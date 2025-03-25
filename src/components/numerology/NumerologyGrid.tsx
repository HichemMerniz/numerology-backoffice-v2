import { useLanguage } from "@/context/LanguageContext";

type NumerologyGridProps = {
  lifePath: {
    value: number;
    pillar: number;
    inclusion: number;
  };
  expression: {
    value: string;
    pillar: string;
    inclusion: number;
  };
  intimate: {
    value: number;
    pillar: number;
    inclusion: number;
  };
  realization: {
    value: string;
    pillar: number;
    inclusion: number;
  };
};

export function NumerologyGrid({
  lifePath,
  expression,
  intimate,
  realization,
}: NumerologyGridProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-px bg-border">
        {/* Life Path */}
        <div className="bg-background p-4">
          <div className="text-sm mb-2">{t('results.lifePath')}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{lifePath.value}</span>
            <div className="text-sm space-x-2">
              <span className="text-blue-500">({lifePath.pillar})</span>
              <span className="text-red-500">({lifePath.inclusion})</span>
            </div>
          </div>
        </div>

        {/* Expression */}
        <div className="bg-background p-4">
          <div className="text-sm mb-2">{t('results.expression')}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{expression.value}</span>
            <div className="text-sm space-x-2">
              <span className="text-blue-500">{expression.pillar}</span>
              <span className="text-red-500">({expression.inclusion})</span>
            </div>
          </div>
        </div>

        {/* Intimate */}
        <div className="bg-background p-4">
          <div className="text-sm mb-2">{t('results.intimate')}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{intimate.value}</span>
            <div className="text-sm space-x-2">
              <span className="text-blue-500">({intimate.pillar})</span>
              <span className="text-red-500">({intimate.inclusion})</span>
            </div>
          </div>
        </div>

        {/* Realization */}
        <div className="bg-background p-4">
          <div className="text-sm mb-2">{t('results.realization')}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{realization.value}</span>
            <div className="text-sm space-x-2">
              <span className="text-blue-500">({realization.pillar})</span>
              <span className="text-red-500">({realization.inclusion})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="font-medium">légende :</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-blue-500">pilier</span>
            </div>
            <div className="flex items-center">
              <span className="text-red-500">grille d'inclusion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 