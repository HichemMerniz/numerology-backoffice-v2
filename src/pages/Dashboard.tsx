import { useState, useContext } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getNumerologyData, generateNumerologyPDF } from "../services/api";
import { Download, Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NumerologyGrid } from "@/components/numerology/NumerologyGrid";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parse } from "date-fns";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleNames: [""],
    birthDate: "",
    maritalName: "",
    usedFirstName: "",
    carriedNameFor25Years: false,
  });
  const [result, setResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const { t } = useLanguage();

  const formatDateInput = (value: string): string => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as DD/MM/YYYY
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

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

  const handleInputChange = (field: string, value: string | boolean | Date) => {
    if (field === "birthDate" && value instanceof Date) {
      setFormData((prev) => ({ ...prev, [field]: format(value, "dd/MM/yyyy") }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleMiddleNameChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newMiddleNames = [...prev.middleNames];
      newMiddleNames[index] = value;
      return { ...prev, middleNames: newMiddleNames };
    });
  };

  const addMiddleName = () => {
    setFormData((prev) => ({
      ...prev,
      middleNames: [...prev.middleNames, ""],
    }));
  };

  const removeMiddleName = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      middleNames: prev.middleNames.filter((_, i) => i !== index),
    }));
  };

  const fetchNumerology = async () => {
    if (!auth?.token) return;
    if (!formData.firstName || !formData.lastName || !formData.birthDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate date format and validity
    if (!validateDate(formData.birthDate)) {
      toast({
        title: "Error",
        description: "Please enter a valid date in DD/MM/YYYY format",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await getNumerologyData(auth.token, formData);
      setResult(data);
      toast({
        title: "Success",
        description: "Numerology calculation completed",
      });
    } catch (error) {
      console.error("Error fetching numerology data:", error);
      toast({
        title: "Error",
        description: "Failed to calculate numerology",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async (pdfUrl: string) => {
    if (!auth?.token) return;
    try {
      setIsGenerating(true);
      window.open(API_BASE_URL + "/api/pdf/download" + pdfUrl + ".pdf", '_blank');
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Calculator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-card/50 border-primary/20 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            <CardHeader className="space-y-1 relative">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("calculator.title")}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground/80">
                {t("calculator.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid gap-8">
                <div className="grid gap-6">
                  {/* Name Fields Section */}
                  <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 space-y-6">
                    <h3 className="text-xl font-semibold text-primary/80">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-base font-medium inline-flex items-center gap-2">
                          {t("calculator.firstName")}
                          <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 text-base transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-base font-medium inline-flex items-center gap-2">
                          {t("calculator.lastName")}
                          <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 text-base transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">{t("calculator.middleNames")}</Label>
                      <div className="space-y-3">
                        {formData.middleNames.map((name, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-2"
                          >
                            <Input
                              value={name}
                              onChange={(e) => handleMiddleNameChange(index, e.target.value)}
                              placeholder={`Middle name ${index + 1}`}
                              className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 text-base transition-colors"
                            />
                            {formData.middleNames.length > 1 && (
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeMiddleName(index)}
                                className="h-12 w-12 hover:bg-destructive/90 transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            )}
                          </motion.div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addMiddleName}
                          className="h-10 text-base hover:bg-primary/5 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t("calculator.addMiddleName")}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Birth Date Section */}
                  <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
                    <h3 className="text-xl font-semibold text-primary/80">Birth Information</h3>
                    <div className="space-y-3">
                      <Label htmlFor="birthDate" className="text-base font-medium inline-flex items-center gap-2">
                        {t("calculator.dob")}
                        <span className="text-primary">*</span>
                      </Label>
                      <DatePicker
                        date={formData.birthDate ? parse(formData.birthDate, "dd/MM/yyyy", new Date()) : undefined}
                        onSelect={(date) => handleInputChange("birthDate", date as Date)}
                        placeholder="DD/MM/YYYY"
                      />
                      <p className="text-sm text-muted-foreground">
                        Format: DD/MM/YYYY
                      </p>
                    </div>
                  </div>

                  {/* Additional Information Section */}
                  <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 space-y-6">
                    <h3 className="text-xl font-semibold text-primary/80">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="maritalName" className="text-base font-medium">
                          {t("calculator.maritalName")}
                        </Label>
                        <Input
                          id="maritalName"
                          type="text"
                          placeholder="Enter marital name (optional)"
                          value={formData.maritalName}
                          onChange={(e) => handleInputChange("maritalName", e.target.value)}
                          className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 text-base transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="usedFirstName" className="text-base font-medium">
                          {t("calculator.usedFirstName")}
                        </Label>
                        <Input
                          id="usedFirstName"
                          type="text"
                          placeholder="Enter used first name (optional)"
                          value={formData.usedFirstName}
                          onChange={(e) => handleInputChange("usedFirstName", e.target.value)}
                          className="h-12 bg-background/50 border-primary/20 focus:border-primary/40 text-base transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 py-2">
                      <Switch
                        id="carriedNameFor25Years"
                        checked={formData.carriedNameFor25Years}
                        onCheckedChange={(checked: boolean) =>
                          handleInputChange("carriedNameFor25Years", checked)
                        }
                      />
                      <Label htmlFor="carriedNameFor25Years" className="text-base font-medium">
                        {t("calculator.carriedNameFor25Years")}
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={fetchNumerology}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/20"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("calculator.calculating")}
                      </>
                    ) : (
                      t("calculator.button")
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Card className="backdrop-blur-sm bg-card/50 border-primary/20 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {t("results.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                            {result[item.key]}
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
                            {result[item.key]}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Cycles Section */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-primary/80">{t("results.cycles")}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(result.cycles).map(([cycle, data], index) => {
                          const cycleData = data as { number: number; years: string };
                          return (
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
                                {cycleData.number}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {cycleData.years}
                              </p>
                            </motion.div>
                          );
                        })}
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
                              {result.challenges[item.key]}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Realizations Section */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-primary/80">{t("results.realizations")}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {Object.entries(result.realizations).map(([period, age], index) => (
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
                        {Object.entries(result.personalityTraits).map(([trait, value], index) => (
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
                        <NumerologyGrid
                          lifePath={{
                            value: result.lifePath,
                            pillar: result.lifePath,
                            inclusion: result.lifePath
                          }}
                          expression={{
                            value: result.expression.toString(),
                            pillar: result.expression.toString(),
                            inclusion: result.expression
                          }}
                          intimate={{
                            value: result.intimate,
                            pillar: result.intimate,
                            inclusion: result.intimate
                          }}
                          realization={{
                            value: result.realization.toString(),
                            pillar: result.realization,
                            inclusion: result.realization
                          }}
                        />
                      </div>
                    </div>

                    {/* PDF Generation Button */}
                    <div className="flex justify-end">
                      <Button
                        onClick={() => generatePDF(result?.pdfUrl)}
                        variant="outline"
                        className="flex items-center gap-2 h-12 text-lg font-semibold hover:bg-primary/5 transition-all duration-300"
                        disabled={true}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("results.generating")}
                          </>
                        ) : (
                          <>
                            <Download className="h-5 w-5" />
                            {t("results.generateReport")}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
