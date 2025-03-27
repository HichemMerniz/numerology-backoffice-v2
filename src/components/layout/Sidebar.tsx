import { Link, useLocation } from "react-router-dom";
import { Home, Calculator, Settings, LogOut, Menu, X, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: "/", icon: Home },
    { name: t('nav.history'), href: "/history", icon: History },
    { name: t('nav.settings'), href: "/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow pt-5 bg-background border-r overflow-y-auto">
      <div className="flex items-center justify-between flex-shrink-0 px-4">
        <h1 className="text-xl font-bold text-primary">Numerology</h1>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-2 rounded-md hover:bg-muted"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                    aria-hidden="true"
                  />
                </motion.div>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex-shrink-0 flex border-t p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="flex-shrink-0 w-full group block p-2 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <div className="flex items-center">
              <div>
                <LogOut className="inline-block h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  {t('nav.logout')}
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border shadow-sm hover:bg-muted transition-colors duration-200"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 