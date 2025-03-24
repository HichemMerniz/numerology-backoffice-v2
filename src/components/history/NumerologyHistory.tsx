// import { useEffect, useState, useContext } from "react";
// import { useLanguage } from "@/context/LanguageContext";
// import { getNumerologyReadingsHistory, generateNumerologyPDF, deleteNumerologyReading } from "@/services/api";
// import { AuthContext } from "@/context/AuthContext";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { Download, Eye, Trash2, FileText, AlertTriangle } from "lucide-react";
// import { format } from "date-fns";
// import { ReadingDetailsModal } from "./ReadingDetailsModal";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "@/components/ui/use-toast";
// import { API_BASE_URL } from "@/config/api";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// type HistoryResponse = {
//   readings: HistoryEntry[];
//   totalPages: number;
//   currentPage: number;
//   totalReadings: number;
// };

// type HistoryEntry = {
//   id: string;
//   name: string;
//   dob: string;
//   pdfUrl:string;
//   createdAt: string;
//   readings: {
//     lifePath: { name: string; value: number };
//     expression: { name: string; value: number };
//     soulUrge: { name: string; value: number };
//   };
// };

// interface NumerologyHistoryProps {
//   refreshTrigger: number;
// }

// export function NumerologyHistory({ refreshTrigger }: NumerologyHistoryProps) {
//   const [history, setHistory] = useState<HistoryEntry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedReading, setSelectedReading] = useState<HistoryEntry | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
//   const [deleting, setDeleting] = useState<string | null>(null);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [readingToDelete, setReadingToDelete] = useState<HistoryEntry | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalReadings, setTotalReadings] = useState(0);
//   const [itemsPerPage] = useState(10);
//   const auth = useContext(AuthContext);
//   const { t } = useLanguage();

//   const fetchHistory = async (page = currentPage) => {
//     if (!auth?.token) return;
    
//     try {
//       setLoading(true);
//       const data = await getNumerologyReadingsHistory(page, itemsPerPage);
//       setHistory(data.readings || []);
//       setTotalPages(data.totalPages);
//       setCurrentPage(data.currentPage);
//       setTotalReadings(data.totalReadings);
//     } catch (error) {
//       setError("Failed to load history");
//       console.error("Error fetching history:", error);
//       toast({
//         title: t('history.error.title'),
//         description: t('history.error.description'),
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory(1); // Reset to first page when refresh is triggered
//   }, [auth?.token, refreshTrigger]);

//   const handleViewDetails = (reading: HistoryEntry) => {
//     setSelectedReading(reading);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), "PPP");
//     } catch (e) {
//       return dateString;
//     }
//   };

//   const generatePDF = async (reading: HistoryEntry, readingId: string) => {
//     if (!auth?.token) return;
    
//     try {
//       setGeneratingPDF(reading.id);
//       console.log(reading);
//       const data = await generateNumerologyPDF(
//         auth.token, 
//         reading.name, 
//         reading.dob,
//         reading.id // Use the reading.id instead of pdfUrl
//       );
      
//       // Open the PDF in a new tab
//       window.open(API_BASE_URL + "/api/pdf/download" + reading.pdfUrl+".pdf", '_blank');
      
//       toast({
//         title: t('history.pdfSuccess.title'),
//         description: t('history.pdfSuccess.description'),
//       });
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       toast({
//         title: t('history.pdfError.title'),
//         description: t('history.pdfError.description'),
//         variant: "destructive",
//       });
//     } finally {
//       setGeneratingPDF(null);
//     }
//   };

//   const confirmDelete = (reading: HistoryEntry) => {
//     setReadingToDelete(reading);
//     setShowDeleteDialog(true);
//   };

//   const handleDelete = async () => {
//     if (!readingToDelete) return;
    
//     try {
//       setDeleting(readingToDelete.id);
//       await deleteNumerologyReading(readingToDelete.id);
      
//       // Remove from UI
//       setHistory(history.filter(item => item.id !== readingToDelete.id));
//       setTotalReadings(prev => prev - 1);
      
//       // If we deleted the last item on the current page and there are more pages, go to previous page
//       if (history.length === 1 && currentPage > 1) {
//         fetchHistory(currentPage - 1);
//       }
      
//       toast({
//         title: t('history.deleteSuccess.title'),
//         description: t('history.deleteSuccess.description'),
//       });
      
//       setShowDeleteDialog(false);
//     } catch (error) {
//       console.error("Error deleting reading:", error);
//       toast({
//         title: t('history.deleteError.title'),
//         description: t('history.deleteError.description'),
//         variant: "destructive",
//       });
//     } finally {
//       setDeleting(null);
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     setCurrentPage(newPage);
//     fetchHistory(newPage);
//   };

//   const tableVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.1
//       }
//     }
//   };
  
//   const rowVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 12
//       }
//     }
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Card className="backdrop-blur-sm bg-card/50 overflow-hidden">
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <div>
//                 <CardTitle>{t('history.title')}</CardTitle>
//                 <CardDescription>
//                   {t('history.description')}
//                   {totalReadings > 0 && (
//                     <span className="ml-2 text-primary">
//                       {t('history.totalReadings', { count: totalReadings })}
//                     </span>
//                   )}
//                 </CardDescription>
//               </div>
//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 onClick={() => fetchHistory(1)}
//                 className="flex items-center gap-2 transition-all hover:scale-105"
//                 disabled={loading}
//               >
//                 <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 <span>{t('history.refresh')}</span>
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center py-16">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//               </div>
//             ) : error ? (
//               <motion.div 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-destructive text-center py-8 flex flex-col items-center gap-3"
//               >
//                 <svg className="h-12 w-12 text-destructive opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="font-medium">{error}</p>
//                 <Button variant="outline" size="sm" onClick={() => fetchHistory(1)}>
//                   {t('history.tryAgain')}
//                 </Button>
//               </motion.div>
//             ) : history.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="text-center py-16 text-muted-foreground flex flex-col items-center gap-4"
//               >
//                 <FileText className="h-16 w-16 opacity-20" />
//                 <div>
//                   <p className="text-lg font-medium">{t('history.noData')}</p>
//                   <p className="text-sm max-w-md mx-auto mt-2">{t('history.startCalculating')}</p>
//                 </div>
//               </motion.div>
//             ) : (
//               <div className="rounded-md border overflow-hidden">
//                 <motion.div
//                   variants={tableVariants}
//                   initial="hidden"
//                   animate="visible"
//                 >
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>{t('history.name')}</TableHead>
//                         <TableHead>{t('history.dob')}</TableHead>
//                         <TableHead>{t('history.date')}</TableHead>
//                         <TableHead className="text-right">{t('history.actions')}</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       <AnimatePresence mode="wait">
//                         {history.map((entry) => (
//                           <motion.tr
//                             key={entry.id}
//                             variants={rowVariants}
//                             className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group"
//                             layout
//                             exit={{ opacity: 0, height: 0 }}
//                           >
//                             <TableCell className="font-medium">{entry.name}</TableCell>
//                             <TableCell>{formatDate(entry.dob)}</TableCell>
//                             <TableCell>{formatDate(entry.createdAt)}</TableCell>
//                             <TableCell className="text-right flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="h-8 w-8 p-0 rounded-full hover:scale-110 transition-transform"
//                                 onClick={() => handleViewDetails(entry)}
//                                 title={t('history.viewDetails')}
//                               >
//                                 <Eye className="h-4 w-4" />
//                                 <span className="sr-only">{t('history.viewDetails')}</span>
//                               </Button>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="h-8 w-8 p-0 rounded-full hover:scale-110 transition-transform"
//                                 onClick={() => generatePDF(entry, entry.id)}
//                                 disabled={generatingPDF === entry.id}
//                                 title={t('history.downloadPdf')}
//                               >
//                                 {generatingPDF === entry.id ? (
//                                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
//                                 ) : (
//                                   <Download className="h-4 w-4" />
//                                 )}
//                                 <span className="sr-only">{t('history.downloadPdf')}</span>
//                               </Button>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm"
//                                 className="h-8 w-8 p-0 rounded-full hover:scale-110 transition-transform hover:text-destructive"
//                                 onClick={() => confirmDelete(entry)}
//                                 disabled={deleting === entry.id}
//                                 title={t('history.deleteReading')}
//                               >
//                                 {deleting === entry.id ? (
//                                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
//                                 ) : (
//                                   <Trash2 className="h-4 w-4" />
//                                 )}
//                                 <span className="sr-only">{t('history.deleteReading')}</span>
//                               </Button>
//                             </TableCell>
//                           </motion.tr>
//                         ))}
//                       </AnimatePresence>
//                     </TableBody>
//                   </Table>
//                 </motion.div>
//               </div>
//             )}
//           </CardContent>
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <CardFooter className="flex justify-between items-center pt-4">
//               <div className="text-sm text-muted-foreground">
//                 {t('history.pagination.showing', { 
//                   start: ((currentPage - 1) * itemsPerPage) + 1, 
//                   end: Math.min(currentPage * itemsPerPage, totalReadings),
//                   total: totalReadings 
//                 })}
//               </div>
//               <div className="flex gap-1">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === 1 || loading}
//                   onClick={() => handlePageChange(1)}
//                   className="w-8 h-8 p-0"
//                 >
//                   <span className="sr-only">{t('history.pagination.first')}</span>
//                   <span>«</span>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === 1 || loading}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   className="w-8 h-8 p-0"
//                 >
//                   <span className="sr-only">{t('history.pagination.previous')}</span>
//                   <span>‹</span>
//                 </Button>
                
//                 {/* Page numbers */}
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   // Center current page in the displayed pages
//                   let pageNum: number;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }
                  
//                   return (
//                     <Button
//                       key={pageNum}
//                       variant={currentPage === pageNum ? "default" : "outline"}
//                       size="sm"
//                       disabled={loading}
//                       onClick={() => handlePageChange(pageNum)}
//                       className="w-8 h-8 p-0"
//                     >
//                       <span>{pageNum}</span>
//                     </Button>
//                   );
//                 })}
                
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === totalPages || loading}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   className="w-8 h-8 p-0"
//                 >
//                   <span className="sr-only">{t('history.pagination.next')}</span>
//                   <span>›</span>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={currentPage === totalPages || loading}
//                   onClick={() => handlePageChange(totalPages)}
//                   className="w-8 h-8 p-0"
//                 >
//                   <span className="sr-only">{t('history.pagination.last')}</span>
//                   <span>»</span>
//                 </Button>
//               </div>
//             </CardFooter>
//           )}
//         </Card>
//       </motion.div>
      
//       {/* Delete Confirmation Dialog */}
//       <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-destructive" />
//               {t('history.deleteDialog.title')}
//             </DialogTitle>
//             <DialogDescription>
//               {readingToDelete && (
//                 <>
//                   {t('history.deleteDialog.description')}
//                   <p className="mt-2 font-medium text-foreground">
//                     {readingToDelete.name} ({formatDate(readingToDelete.dob)})
//                   </p>
//                 </>
//               )}
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="flex sm:justify-between gap-2 mt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setShowDeleteDialog(false)}
//               className="sm:w-auto w-full"
//             >
//               {t('history.deleteDialog.cancel')}
//             </Button>
//             <Button
//               type="button"
//               variant="destructive"
//               onClick={handleDelete}
//               disabled={deleting !== null}
//               className="sm:w-auto w-full flex gap-2 items-center"
//             >
//               {deleting ? (
//                 <>
//                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
//                   {t('history.deleteDialog.deleting')}
//                 </>
//               ) : (
//                 <>
//                   <Trash2 className="h-4 w-4" />
//                   {t('history.deleteDialog.confirm')}
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
      
//       {/* Reading details modal */}
//       {selectedReading && (
//         <ReadingDetailsModal
//           reading={selectedReading}
//           isOpen={isModalOpen}
//           onClose={closeModal}
//           onGeneratePDF={(reading:any) => generatePDF(reading, reading.id)}
//         />
//       )}
//     </>
//   );
// } 