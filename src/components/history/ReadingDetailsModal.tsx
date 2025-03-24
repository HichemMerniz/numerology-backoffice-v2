import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

type HistoryEntry = {
  id: string;
  name: string;
  dob: string;
  createdAt: string;
  pdfUrl?: string;
  readings: {
    lifePath: { name: string; value: number };
    expression: { name: string; value: number };
    soulUrge: { name: string; value: number };
  };
};

type ReadingDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reading: HistoryEntry | null;
  onGeneratePDF?: (reading: HistoryEntry) => void;
};

export function ReadingDetailsModal({
  isOpen,
  onClose,
  reading,
  onGeneratePDF,
}: ReadingDetailsModalProps) {
  const { t } = useLanguage();

  if (!reading) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  // Define number colors based on numerology traditions
  const getNumberColor = (num: number) => {
    const colors: Record<number, string> = {
      1: "from-red-500 to-red-600",
      2: "from-orange-400 to-orange-500",
      3: "from-yellow-400 to-yellow-500",
      4: "from-lime-500 to-green-600",
      5: "from-teal-500 to-cyan-600",
      6: "from-sky-500 to-blue-600",
      7: "from-indigo-500 to-violet-600",
      8: "from-purple-500 to-purple-600",
      9: "from-fuchsia-500 to-pink-600",
    };
    return colors[num] || "from-gray-500 to-gray-600";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md overflow-hidden p-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="flex justify-between items-center">
                  <span>{reading.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
                <DialogDescription>
                  {formatDate(reading.dob)} • {t("history.calculatedOn")}{" "}
                  {formatDate(reading.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Life Path */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="p-6 rounded-lg bg-gradient-to-br bg-opacity-90 shadow-lg"
                    style={{ background: "rgba(var(--primary), 0.03)" }}
                  >
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                      {t("results.lifePath")}
                    </h3>
                    <div className="mt-2 flex items-end gap-3">
                      <div
                        className={`text-5xl font-bold bg-gradient-to-r ${getNumberColor(
                          reading.readings.lifePath.value
                        )} bg-clip-text text-transparent`}
                      >
                        {reading.readings.lifePath.value}
                      </div>
                      <div className="text-sm text-muted-foreground leading-tight pb-1">
                        {t(
                          `numerology.lifePath.${reading.readings.lifePath.value}.brief`,
                          { fallback: "" }
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Expression & Soul Urge */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="p-4 rounded-lg shadow-sm"
                      style={{ background: "rgba(var(--primary), 0.01)" }}
                    >
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        {t("results.expression")}
                      </h3>
                      <div
                        className={`text-4xl font-bold bg-gradient-to-r ${getNumberColor(
                          reading.readings.expression.value
                        )} bg-clip-text text-transparent`}
                      >
                        {reading.readings.expression.value}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="p-4 rounded-lg shadow-sm"
                      style={{ background: "rgba(var(--primary), 0.01)" }}
                    >
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        {t("results.soulUrge")}
                      </h3>
                      <div
                        className={`text-4xl font-bold bg-gradient-to-r ${getNumberColor(
                          reading.readings.soulUrge.value
                        )} bg-clip-text text-transparent`}
                      >
                        {reading.readings.soulUrge.value}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* {onGeneratePDF && (
                <DialogFooter className="p-6 pt-0 bg-muted/10">
                  
                  <Button
                    onClick={() => onGeneratePDF(reading)}
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    {t("history.downloadPdf")}
                  </Button>
                </DialogFooter>
              )} */}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
