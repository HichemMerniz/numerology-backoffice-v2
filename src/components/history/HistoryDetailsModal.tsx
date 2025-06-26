import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

interface HistoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onGeneratePDF: (id: string) => void;
  isGenerating: boolean;
}

export function HistoryDetailsModal({
  isOpen,
  onClose,
  data,
  onGeneratePDF,
  isGenerating,
}: HistoryDetailsModalProps) {
  const { t } = useLanguage();

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("results.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8">
          {/* Core Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: "lifePath", label: t("results.lifePath") },
              { key: "expression", label: t("results.expression") },
              { key: "intimate", label: t("results.intimate") },
            ].map((item) => (
              <motion.div
                key={item.key}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-semibold text-lg mb-3 text-primary/80">
                  {item.label}
                </h3>
                <p className="text-4xl font-bold text-primary">
                  {data[item.key]}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Additional Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: "realization", label: t("results.realization") },
              { key: "health", label: t("results.health") },
              { key: "sentiment", label: t("results.sentiment") },
            ].map((item) => (
              <motion.div
                key={item.key}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-semibold text-lg mb-3 text-primary/80">
                  {item.label}
                </h3>
                <p className="text-4xl font-bold text-primary">
                  {data[item.key]}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Cycles Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary/80">{t("results.cycles")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.cycles && Object.entries(data.cycles).map(([cycle, data]: [string, any], index) => (
                <motion.div
                  key={cycle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
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

          {/* Challenges Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary/80">{t("results.challenges")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: "firstMinor", label: t("results.firstMinor") },
                { key: "secondMinor", label: t("results.secondMinor") },
                { key: "major", label: t("results.major") },
              ].map((item) => (
                <motion.div
                  key={item.key}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h4 className="font-semibold text-lg mb-2 text-primary/80">
                    {item.label}
                  </h4>
                  <p className="text-3xl font-bold text-primary">
                    {data.challenges?.[item.key]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Realizations Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary/80">{t("results.realizations")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {data.realizations && Object.entries(data.realizations).map(([period, age], index) => (
                <motion.div
                  key={period}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h4 className="font-semibold text-lg mb-2 capitalize text-primary/80">
                    {period}
                  </h4>
                  <p className="text-3xl font-bold text-primary">
                    {age as number}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary/80">{t("results.personalityTraits")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.personalityTraits && Object.entries(data.personalityTraits).map(([trait, value], index) => (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h4 className="font-semibold text-lg mb-2 capitalize text-primary/80">
                    {trait}
                  </h4>
                  <p className="text-3xl font-bold text-primary">
                    {value as number}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Numerology Grid */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-primary/80">{t("results.coreNumbers")}</h3>
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm">
              {/* <NumerologyGrid
                lifePath={{
                  value: data.lifePath || 0,
                  pillar: data.lifePath || 0,
                  inclusion: data.lifePath || 0
                }}
                expression={{
                  value: (data.expression || 0).toString(),
                  pillar: (data.expression || 0).toString(),
                  inclusion: data.expression || 0
                }}
                intimate={{
                  value: data.intimate || 0,
                  pillar: data.intimate || 0,
                  inclusion: data.intimate || 0
                }}
                realization={{
                  value: (data.realization || 0).toString(),
                  pillar: data.realization || 0,
                  inclusion: data.realization || 0
                }}
                heredityNumber={{
                  value: data.heredityNumber || 0,
                  pillar: data.heredityNumber || 0,
                  inclusion: data.heredityNumber || 0
                }}
                inclusionGrid={{
                  values: data.inclusionGrid?.values || [0, 0, 0, 0, 0, 0, 0, 0, 0],
                  total: data.inclusionGrid?.total || 0
                }}
                letterAnalysis={{
                  values: data.letterAnalysis?.values || []
                }}
              /> */}
            </div>
          </div>

          {/* PDF Generation Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => onGeneratePDF(data.resultId)}
              variant="outline"
              className="flex items-center gap-2 h-12 text-lg font-semibold hover:bg-primary/5 transition-all duration-300"
              disabled={isGenerating}
            >
              <Download className="h-5 w-5" />
              {t("results.generateReport")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 