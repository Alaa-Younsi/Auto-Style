import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: "left" | "right";
}

export function Drawer({ open, onClose, children, title, side = "right" }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: side === "right" ? "100%" : "-100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: side === "right" ? "100%" : "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
            className={cn(
              "fixed top-0 bottom-0 z-50 flex flex-col",
              "w-full sm:w-[420px] bg-panel border-line",
              side === "right"
                ? "right-0 border-l rounded-l-bento"
                : "left-0 border-r rounded-r-bento"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-line">
              {title && (
                <h2 className="font-mono text-xs uppercase tracking-widest text-ink">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className={cn(
                  "ml-auto p-2 rounded-lg text-muted hover:text-ink hover:bg-line/40 transition-colors",
                )}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
