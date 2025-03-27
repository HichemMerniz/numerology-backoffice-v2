import { useState, useContext, useEffect } from "react";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Check for saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: t('login.error'),
        description: t('login.fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    // Save email if "Remember me" is checked
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      auth?.login(data.token);
      toast({
        title: t('login.success'),
        description: t('login.welcomeBack'),
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t('login.error'),
        description: t('login.invalidCredentials'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="min-h-screen w-full py-8 md:py-16 px-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      {/* Animated background elements */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={backgroundVariants}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[50%] top-[50%] -z-10 h-[600px] w-[600px] -translate-x-[50%] -translate-y-[50%] rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[25%] top-[25%] -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[25%] bottom-[25%] -z-10 h-[400px] w-[400px] rounded-full bg-primary/15 blur-2xl"
        />
      </motion.div>



      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md relative z-10"
      >
        <Card className="w-full backdrop-blur-sm bg-card/60 border-primary/20 shadow-xl">
          <CardHeader className="space-y-3">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t('login.title')}
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-center text-base sm:text-lg">
                {t('login.subtitle')}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="email">
                  {t('login.email')}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/60 border-primary/20 focus-visible:ring-primary/40 h-10 sm:h-12 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-sm font-medium" htmlFor="password">
                  {t('login.password')}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/60 border-primary/20 focus-visible:ring-primary/40 h-10 sm:h-12 pr-12 transition-all"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={showPassword ? "hide" : "show"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                    {t('login.rememberMe')}
                  </Label>
                </div>
                {/* <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  {t('login.forgotPassword')}
                </Link> */}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 text-base group overflow-hidden relative"
                  disabled={isLoading}
                >
                  <span
                    className={`flex items-center justify-center transition-all duration-300 transform ${isLoading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                      }`}
                  >
                    {t('login.submit')}
                  </span>
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>
          </CardContent>
          {/* <CardFooter className="flex justify-center pt-0">
            <motion.p
              variants={itemVariants}
              className="text-sm text-muted-foreground"
            >
              {t('login.noAccount')}
              <Link to="/register" className="text-primary font-medium ml-1 hover:underline transition-colors">
                {t('login.register')}
              </Link>
            </motion.p>
          </CardFooter> */}
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;