import { useState, useContext, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Download, Loader2, History as HistoryIcon } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { HistoryDetailsModal } from "@/components/history/HistoryDetailsModal";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const auth = useContext(AuthContext);
  const { t } = useLanguage();

  const generatePDF = async (resultId: string) => {
    if (!auth?.token) return;
    try {
      setIsGenerating(true);
      const link = document.createElement('a');
      link.href = `${API_BASE_URL}/api/calculations/result/${resultId}/pdf`;
      link.setAttribute('download', `numerology-report-${resultId}.pdf`);
      
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${auth.token}`);
      
      const response = await fetch(link.href, {
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      link.href = url;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchHistory = async (page: number = 1) => {
    if (!auth?.token) return;
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/calculations/all?page=${page}&limit=${pageSize}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(Array.isArray(data.calculations) ? data.calculations : []);
      setTotalPages(Math.ceil(data.total / pageSize));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]);
      setTotalPages(1);
      setCurrentPage(1);
      toast({
        title: "Error",
        description: "Failed to load calculation history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [auth?.token, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-card/50 border-primary/20 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {t("history.title")}
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchHistory(currentPage)}
                  disabled={isLoadingHistory}
                  className="h-8"
                >
                  {isLoadingHistory ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("history.refresh")
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("history.noCalculations")}
                </div>
              ) : (
                <div className="grid gap-4">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {item.data.nameAnalysis.firstName.letters.join('')} {item.data.nameAnalysis.lastName.letters.join('')}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy HH:mm") : t("history.calculatedOn")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePDF(item.id)}
                            disabled={isGenerating}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t("history.downloadPdf")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedHistoryItem(item.data)}
                          >
                            {t("history.viewDetails")}
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">{t("results.lifePath")}:</span>
                          <span className="ml-1 font-medium">{item.data.lifePath}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("results.expression")}:</span>
                          <span className="ml-1 font-medium">{item.data.expression}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t("results.intimate")}:</span>
                          <span className="ml-1 font-medium">{item.data.intimate}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {history.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {t("history.pagination.page")} {currentPage} {t("history.pagination.of")} {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoadingHistory}
                    >
                      {t("history.pagination.previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoadingHistory}
                    >
                      {t("history.pagination.next")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <HistoryDetailsModal
          isOpen={!!selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
          data={selectedHistoryItem}
          onGeneratePDF={generatePDF}
          isGenerating={isGenerating}
        />
      </div>
    </DashboardLayout>
  );
} 