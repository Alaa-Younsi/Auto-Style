import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductImage } from "@/types/db";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: ProductImage[];
  productName: string;
}

export function Gallery({ images, productName }: GalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square rounded-bento bg-panel-2 border border-line/30 flex items-center justify-center">
        <span className="text-muted text-xs font-mono uppercase tracking-wider">No image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-bento bg-panel-2 overflow-hidden border border-line/30">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />
        <AnimatePresence mode="wait">
          <motion.img
            key={images[active]?.url}
            src={images[active]?.url}
            alt={images[active]?.alt ?? productName}
            className="w-full h-full object-contain p-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border transition-all",
                i === active ? "border-brand" : "border-line/50 hover:border-muted/50"
              )}
            >
              <img
                src={img.url}
                alt={img.alt ?? productName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
