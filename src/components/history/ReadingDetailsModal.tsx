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
import { NumerologyGrid } from "../numerology/NumerologyGrid";

type HistoryEntry = {
  id: string;
  name: string;
  dob: string;
  createdAt: string;
  pdfUrl?: string;
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

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="space-y-4">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-bold">
                    {reading.name}
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 rounded-full hover:bg-muted/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DialogDescription className="text-sm text-muted-foreground">
                  {formatDate(reading.dob)} • {t("history.calculatedOn")}{" "}
                  {formatDate(reading.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="py-6">
                <NumerologyGrid
                  lifePath={reading.readings.lifePath}
                  expression={reading.readings.expression}
                  intimate={reading.readings.intimate}
                  realization={reading.readings.realization}
                />
              </div>

              {onGeneratePDF && (
                <DialogFooter className="border-t pt-4">
                  <Button
                    onClick={() => onGeneratePDF(reading)}
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    {t("history.downloadPdf")}
                  </Button>
                </DialogFooter>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
