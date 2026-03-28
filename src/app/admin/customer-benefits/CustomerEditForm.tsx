import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerPurchase } from "@/lib/customers";
import React, { useRef } from "react";
import { CalendarIcon, PlusCircle, ShieldCheck } from "lucide-react";

interface EditFormProps {
  formData: Partial<CustomerPurchase>;
  setFormData: (data: Partial<CustomerPurchase>) => void;
  onCancel: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function CustomerEditForm({
  formData,
  setFormData,
  onCancel,
  onSave,
}: EditFormProps) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDateChange = (index: number, value: string) => {
    const newDates = [...(formData.purchaseDates || [])];
    while (newDates.length < 10) newDates.push("");
    newDates[index] = value;
    
    const lastFilledIndex = [...newDates].reverse().findIndex(d => d && d.trim() !== "");
    const newCount = lastFilledIndex === -1 ? 0 : 10 - lastFilledIndex;
    
    setFormData({ 
      ...formData, 
      purchaseDates: newDates,
      purchasesCount: Math.max(formData.purchasesCount || 0, newCount) 
    });
  };

  const currentCount = formData.purchasesCount || 0;

  return (
    <div className="relative">
      {/* Read-only Verification Badge - Top Right */}
      {formData.isVerified && (
        <div className="absolute top-0 right-0 p-1 md:p-3 z-20">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800 shadow-sm animate-in fade-in zoom-in duration-300">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Verificado</span>
          </div>
        </div>
      )}

      <form onSubmit={onSave} className="space-y-6 md:space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="space-y-2 md:space-y-3">
            <Label className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-60">Nombre Completo</Label>
            <Input
              className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 text-base md:text-lg font-bold focus:ring-primary/20 bg-background/50"
              value={formData.name || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>
          <div className="space-y-2 md:space-y-3">
            <Label className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-60">Email Contacto</Label>
            <Input
              className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 text-base md:text-lg font-bold focus:ring-primary/20 bg-background/50"
              type="email"
              value={formData.email || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="juan@ejemplo.com"
            />
          </div>
          <div className="space-y-2 md:space-y-3">
            <Label className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-60">Usuario / Slug</Label>
            <Input
              className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 text-base md:text-lg font-bold font-mono focus:ring-primary/20 bg-background/50"
              value={formData.username || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  username: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                })
              }
              placeholder="juan-perez"
              required
            />
          </div>
        </div>

        {/* Integrated Progress & Stats Section */}
        <div className="flex flex-col gap-4 py-6 px-4 md:px-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-black border-2 border-primary/10 shadow-xl shadow-primary/5">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="text-5xl md:text-6xl font-black text-primary tracking-tighter">
                   {currentCount}
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs md:text-sm font-black uppercase tracking-widest text-foreground">Compras Registradas</p>
                    <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase opacity-70">
                      Progreso: <span className="text-primary font-black">{currentCount * 10}%</span> del cupón
                    </p>
                 </div>
              </div>
              
              <div className="hidden md:block">
                 <ShieldCheck className={`w-12 h-12 transition-all duration-700 ${currentCount >= 10 ? "text-green-500 scale-110" : "text-primary/10"}`} />
              </div>
           </div>

           <div className="relative w-full h-4 bg-muted/30 rounded-full overflow-hidden border border-primary/5 shadow-inner p-0.5">
             <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
                  currentCount >= 10 
                    ? "bg-gradient-to-r from-green-500 to-emerald-400" 
                    : "bg-gradient-to-r from-primary to-primary/60"
                }`}
                style={{ width: `${currentCount * 10}%` }}
             />
           </div>
        </div>

        {/* Slot Selection Grid */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between gap-3">
             <div className="w-1.5 h-6 bg-primary rounded-full" />
             <Label className="text-base md:text-lg font-black uppercase tracking-tight text-foreground">
               Historial de Slots
             </Label>
             <div className="h-[2px] flex-1 bg-primary/5 rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5">
            {Array.from({ length: 10 }).map((_, i) => {
              const isUnlocked = i < currentCount;
              const isNext = i === currentCount;
              
              return (
                <div 
                  key={i} 
                  onClick={() => {
                    const el = fileInputRefs.current[i] as (HTMLInputElement & { showPicker?: () => void }) | null;
                    if (el) {
                      if (el.showPicker) {
                        el.showPicker();
                      } else {
                        el.click();
                      }
                    }
                  }}
                  className={`
                    group relative p-4 rounded-2xl md:rounded-[1.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden
                    ${isUnlocked 
                      ? "border-primary/20 bg-white dark:bg-black shadow-md hover:border-primary/50" 
                      : isNext 
                      ? "border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary" 
                      : "border-muted/10 bg-muted/5 opacity-40 cursor-not-allowed"}
                  `}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[9px] font-black uppercase ${isUnlocked ? "text-primary/70" : "text-muted-foreground"}`}>
                      S{i + 1}
                    </span>
                    {isUnlocked ? (
                      <CalendarIcon className="w-3 h-3 text-primary" />
                    ) : isNext ? (
                      <PlusCircle className="w-3 h-3 text-primary animate-pulse" />
                    ) : null}
                  </div>
                  
                  <div className="text-center text-sm md:text-lg font-black">
                     {formData.purchaseDates?.[i] || "-- / --"}
                  </div>

                  <input 
                    ref={el => { fileInputRefs.current[i] = el; }}
                    type="date"
                    className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
                    onChange={(e) => {
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        const parts = val.split("-");
                        if (parts.length === 3) {
                           const [, m, d] = parts;
                           handleDateChange(i, `${d}/${m}`);
                        }
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 md:gap-4 pt-4 border-t border-primary/10">
          <Button 
            type="submit" 
            className="flex-1 md:flex-none rounded-xl md:rounded-2xl px-6 md:px-14 h-12 md:h-14 shadow-lg shadow-primary/20 font-black text-base md:text-lg transition-all active:scale-95"
          >
            Guardar Cambios
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 md:flex-none rounded-xl md:rounded-2xl px-6 md:px-10 h-12 md:h-14 border-2 font-black text-base md:text-lg hover:bg-red-50 hover:text-red-500 transition-all font-semibold"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
