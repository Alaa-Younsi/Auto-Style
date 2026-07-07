import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/i18n/LanguageProvider";
import { BentoPanel } from "@/components/ui/BentoPanel";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { WILAYAS } from "@/i18n/wilayas";
import type { DeliveryPrice } from "@/types/db";

function useDeliveryPrices() {
  return useQuery({
    queryKey: ["delivery-prices-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_prices")
        .select("*")
        .order("wilaya");
      if (error) throw error;
      return (data ?? []) as DeliveryPrice[];
    },
  });
}

export function AdminDeliveryPrices() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data, isLoading } = useDeliveryPrices();

  // Local edits: wilaya → { home_price, office_price }
  const [edits, setEdits] = useState<Record<string, { home_price: string; office_price: string }>>({});
  const [savedWilayas, setSavedWilayas] = useState<Set<string>>(new Set());

  const mutation = useMutation({
    mutationFn: async (row: DeliveryPrice) => {
      const edit = edits[row.wilaya];
      const home  = edit ? parseFloat(edit.home_price)  : row.home_price;
      const office = edit ? parseFloat(edit.office_price) : row.office_price;
      const { error } = await supabase
        .from("delivery_prices")
        .upsert({ id: row.id, wilaya: row.wilaya, home_price: home, office_price: office });
      if (error) throw error;
      return row.wilaya;
    },
    onSuccess: (wilaya) => {
      qc.invalidateQueries({ queryKey: ["delivery-prices-admin"] });
      setSavedWilayas((prev) => new Set(prev).add(wilaya));
      setTimeout(() => {
        setSavedWilayas((prev) => {
          const next = new Set(prev);
          next.delete(wilaya);
          return next;
        });
      }, 2000);
    },
  });

  const toggleActive = useMutation({
    mutationFn: async (row: DeliveryPrice) => {
      const { error } = await supabase
        .from("delivery_prices")
        .update({ active: !row.active })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-prices-admin"] });
    },
  });

  const saveAll = useMutation({
    mutationFn: async () => {
      if (!data) return;
      const upserts = data.map((row) => {
        const edit = edits[row.wilaya];
        return {
          id: row.id,
          wilaya: row.wilaya,
          home_price: edit ? parseFloat(edit.home_price) : row.home_price,
          office_price: edit ? parseFloat(edit.office_price) : row.office_price,
        };
      });
      const { error } = await supabase.from("delivery_prices").upsert(upserts);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-prices-admin"] });
      setEdits({});
    },
  });

  const getVal = (row: DeliveryPrice, field: "home_price" | "office_price") =>
    edits[row.wilaya]?.[field] ?? String(row[field]);

  const setVal = (wilaya: string, field: "home_price" | "office_price", val: string) => {
    setEdits((prev) => ({
      ...prev,
      [wilaya]: { home_price: String(prev[wilaya]?.home_price ?? ""), office_price: String(prev[wilaya]?.office_price ?? ""), [field]: val },
    }));
  };

  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-xl font-bold uppercase tracking-tight text-ink">
          {t("admin_delivery_prices")}
        </h1>
        <Button
          onClick={() => saveAll.mutate()}
          disabled={!hasEdits || saveAll.isPending}
          size="sm"
        >
          <Save size={13} />
          {saveAll.isPending ? "…" : t("admin_delivery_save_all")}
        </Button>
      </div>

      <BentoPanel className="overflow-hidden">
        {/* Header (desktop only) */}
        <div className="hidden sm:grid grid-cols-[1fr_140px_140px_110px_80px] gap-2 px-4 py-3 border-b border-line/40 bg-panel-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Wilaya</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted">{t("admin_home_price")}</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted">{t("admin_office_price")}</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted">{t("admin_delivery_status")}</span>
          <span />
        </div>

        {isLoading ? (
          <div className="p-4 flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : (
          <div className="divide-y divide-line/30 max-h-[70vh] overflow-y-auto">
            {/* Render in WILAYAS order so new wilayas 59-69 appear correctly */}
            {WILAYAS.map((wilaya) => {
              const row = data?.find((r) => r.wilaya === wilaya);
              if (!row) return null;
              const isSaved = savedWilayas.has(wilaya);
              const isDirty = !!edits[wilaya];
              const isActive = row.active;

              const saveButton = isSaved ? (
                <CheckCircle2 size={16} className="text-brand" />
              ) : (
                <button
                  onClick={() => mutation.mutate(row)}
                  disabled={!isDirty || mutation.isPending}
                  className="text-[10px] font-mono text-muted hover:text-brand disabled:opacity-30 transition-colors uppercase tracking-wider"
                >
                  {t("admin_save")}
                </button>
              );

              const activeToggle = (
                <button
                  onClick={() => toggleActive.mutate(row)}
                  disabled={toggleActive.isPending}
                  className={cn(
                    "text-[10px] font-mono uppercase tracking-wider px-2.5 py-1.5 rounded-md border transition-colors disabled:opacity-40",
                    isActive
                      ? "border-brand/30 text-brand hover:bg-brand hover:text-ink"
                      : "border-line text-muted hover:border-brand/40 hover:text-brand"
                  )}
                >
                  {isActive ? t("admin_wilaya_disable") : t("admin_wilaya_enable")}
                </button>
              );

              return (
                <div key={wilaya}>
                  {/* Mobile: stacked card so the wilaya name always stays visible */}
                  <div
                    className={cn(
                      "sm:hidden flex flex-col gap-2.5 px-4 py-3",
                      !isActive && "opacity-50"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-semibold text-ink">{wilaya}</span>
                      {activeToggle}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted">{t("admin_home_price")}</span>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={getVal(row, "home_price")}
                          onChange={(e) => setVal(wilaya, "home_price", e.target.value)}
                          className="w-full bg-panel-2 border border-line rounded px-2 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-muted transition-colors"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-muted">{t("admin_office_price")}</span>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={getVal(row, "office_price")}
                          onChange={(e) => setVal(wilaya, "office_price", e.target.value)}
                          className="w-full bg-panel-2 border border-line rounded px-2 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-muted transition-colors"
                        />
                      </label>
                    </div>
                    <div className="flex justify-end">{saveButton}</div>
                  </div>

                  {/* Desktop: single-row grid */}
                  <div
                    className={cn(
                      "hidden sm:grid grid-cols-[1fr_140px_140px_110px_80px] gap-2 items-center px-4 py-2.5 hover:bg-line/10 transition-colors",
                      !isActive && "opacity-50"
                    )}
                  >
                    <span className="text-xs font-mono text-ink/80 truncate">{wilaya}</span>

                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={getVal(row, "home_price")}
                      onChange={(e) => setVal(wilaya, "home_price", e.target.value)}
                      className="w-full bg-panel-2 border border-line rounded px-2 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-muted transition-colors"
                    />

                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={getVal(row, "office_price")}
                      onChange={(e) => setVal(wilaya, "office_price", e.target.value)}
                      className="w-full bg-panel-2 border border-line rounded px-2 py-1.5 text-xs font-mono text-ink focus:outline-none focus:border-muted transition-colors"
                    />

                    {activeToggle}

                    <div className="flex justify-center">{saveButton}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BentoPanel>

      <p className="text-[10px] font-mono text-muted/60 mt-4">
        {hasEdits
          ? `${Object.keys(edits).length} wilaya(s) modifiée(s) — cliquez "Enregistrer tout" ou sauvegardez ligne par ligne.`
          : "Cliquez sur un prix pour le modifier. Tous les prix sont en DA."}
      </p>
    </div>
  );
}
