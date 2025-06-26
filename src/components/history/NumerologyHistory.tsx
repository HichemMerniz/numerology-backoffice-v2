import { useEffect, useState, useContext } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getNumerologyReadingsHistory, generateNumerologyPDF, deleteNumerologyReading } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Eye, Trash2, FileText, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ReadingDetailsModal } from "./ReadingDetailsModal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type HistoryResponse = {
  readings: HistoryEntry[];
  totalPages: number;
  currentPage: number;
  totalReadings: number;
};

type HistoryEntry = {
  id: string;
  name: string;
  dob: string;
  pdfUrl: string;
  createdAt: string;
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
    heredityNumber: {
      name: string;
      value: number;
      pillar: number;
      inclusion: number;
    };
    inclusionGrid: {
      name: string;
      values: number[];
      total: number;
    };
    letterAnalysis: {
      name: string;
      values: {
        letter: string;
        value: number;
      }[];
    };
  };
};

interface NumerologyHistoryProps {
  refreshTrigger: number;
}

export function NumerologyHistory({ refreshTrigger }: NumerologyHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReading, setSelectedReading] = useState<HistoryEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [readingToDelete, setReadingToDelete] = useState<HistoryEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReadings, setTotalReadings] = useState(0);
  const [itemsPerPage] = useState(10);
  const auth = useContext(AuthContext);
  const { t } = useLanguage();

  const fetchHistory = async (page = currentPage) => {
    if (!auth?.token) return;
    
    try {
      setLoading(true);
      const data = await getNumerologyReadingsHistory(page, itemsPerPage);
      setHistory(data.readings || []);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalReadings(data.totalReadings);
    } catch (error) {
      setError("Failed to load history");
      console.error("Error fetching history:", error);
      toast({
        title: t('history.error.title'),
        description: t('history.error.description'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1); // Reset to first page when refresh is triggered
  }, [auth?.token, refreshTrigger]);

  const handleViewDetails = (reading: HistoryEntry) => {
    setSelectedReading(reading);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  const generatePDF = async (reading: HistoryEntry, readingId: string) => {
    if (!auth?.token) return;
    
    try {
      setGeneratingPDF(reading.id);
      console.log(reading);
      const data = await generateNumerologyPDF(
        auth.token, 
        reading.name, 
        reading.dob,
        reading.id // Use the reading.id instead of pdfUrl
      );
      
      // Open the PDF in a new tab
      window.open(API_BASE_URL + "/api/pdf/download" + reading.pdfUrl+".pdf", '_blank');
      
      toast({
        title: t('history.pdfSuccess.title'),
        description: t('history.pdfSuccess.description'),
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: t('history.pdfError.title'),
        description: t('history.pdfError.description'),
        variant: "destructive",
      });
    } finally {
      setGeneratingPDF(null);
    }
  };

  const confirmDelete = (reading: HistoryEntry) => {
    setReadingToDelete(reading);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!readingToDelete) return;
    
    try {
      setDeleting(readingToDelete.id);
      await deleteNumerologyReading(readingToDelete.id);
      
      // Remove from UI
      setHistory(history.filter(item => item.id !== readingToDelete.id));
      setTotalReadings(prev => prev - 1);
      
      // If we deleted the last item on the current page and there are more pages, go to previous page
      if (history.length === 1 && currentPage > 1) {
        fetchHistory(currentPage - 1);
      }
      
      toast({
        title: t('history.deleteSuccess.title'),
        description: t('history.deleteSuccess.description'),
      });
      
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting reading:", error);
      toast({
        title: t('history.deleteError.title'),
        description: t('history.deleteError.description'),
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchHistory(newPage);
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="backdrop-blur-sm bg-card/50 overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t('history.title')}</CardTitle>
                <CardDescription>
                  {t('history.description')}
                  {totalReadings > 0 && (
                    <span className="ml-2 text-primary">
                      {t('history.totalReadings', { count: totalReadings })}
                    </span>
                  )}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchHistory(1)}
                className="flex items-center gap-2 transition-all hover:scale-105"
                disabled={loading}
              >
                <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{t('history.refresh')}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('history.error.title')}</h3>
                <p className="text-muted-foreground">{t('history.error.description')}</p>
              </motion.div>
            ) : history.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('history.empty.title')}</h3>
                <p className="text-muted-foreground">{t('history.empty.description')}</p>
              </motion.div>
            ) : (
              <motion.div
                variants={tableVariants}
                initial="hidden"
                animate="visible"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('history.table.name')}</TableHead>
                      <TableHead>{t('history.table.dob')}</TableHead>
                      <TableHead>{t('results.lifePath')}</TableHead>
                      <TableHead>{t('results.expression')}</TableHead>
                      <TableHead>{t('results.intimate')}</TableHead>
                      <TableHead>{t('results.realization')}</TableHead>
                      <TableHead>{t('results.heredityNumber')}</TableHead>
                      <TableHead>{t('history.table.createdAt')}</TableHead>
                      <TableHead className="text-right">{t('history.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {history.map((reading) => (
                        <motion.tr
                          key={reading.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, y: -20 }}
                          className="group"
                        >
                          <TableCell className="font-medium">{reading.name}</TableCell>
                          <TableCell>{formatDate(reading.dob)}</TableCell>
                          <TableCell>
                            <div className="flex items-baseline gap-1">
                              <span className="font-medium">{reading.readings.lifePath.value}</span>
                              <span className="text-sm text-blue-500">({reading.readings.lifePath.pillar})</span>
                              <span className="text-sm text-red-500">({reading.readings.lifePath.inclusion})</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-baseline gap-1">
                              <span className="font-medium">{reading.readings.expression.value}</span>
                              <span className="text-sm text-blue-500">{reading.readings.expression.pillar}</span>
                              <span className="text-sm text-red-500">({reading.readings.expression.inclusion})</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-baseline gap-1">
                              <span className="font-medium">{reading.readings.intimate.value}</span>
                              <span className="text-sm text-blue-500">({reading.readings.intimate.pillar})</span>
                              <span className="text-sm text-red-500">({reading.readings.intimate.inclusion})</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-baseline gap-1">
                              <span className="font-medium">{reading.readings.realization.value}</span>
                              <span className="text-sm text-blue-500">({reading.readings.realization.pillar})</span>
                              <span className="text-sm text-red-500">({reading.readings.realization.inclusion})</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-baseline gap-1">
                              <span className="font-medium">{reading.readings.heredityNumber.value}</span>
                              <span className="text-sm text-blue-500">({reading.readings.heredityNumber.pillar})</span>
                              <span className="text-sm text-red-500">({reading.readings.heredityNumber.inclusion})</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(reading.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(reading)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => generatePDF(reading, reading.id)}
                                disabled={generatingPDF === reading.id}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Download className={`h-4 w-4 ${generatingPDF === reading.id ? 'animate-spin' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete(reading)}
                                disabled={deleting === reading.id}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                              >
                                <Trash2 className={`h-4 w-4 ${deleting === reading.id ? 'animate-spin' : ''}`} />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </CardContent>
          {totalPages > 1 && (
            <CardFooter className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t('history.pagination.previous')}
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {t('history.pagination.next')}
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      <ReadingDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        reading={selectedReading}
      />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('history.deleteDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('history.deleteDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              {t('history.deleteDialog.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting === readingToDelete?.id}
            >
              {deleting === readingToDelete?.id ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  {t('history.deleteDialog.deleting')}
                </div>
              ) : (
                t('history.deleteDialog.confirm')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 