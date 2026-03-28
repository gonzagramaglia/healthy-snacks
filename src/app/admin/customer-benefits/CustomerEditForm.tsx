import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerPurchase } from "@/lib/customers";
import React, { useRef } from "react";
import { CalendarIcon, PlusCircle } from "lucide-react";

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

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 md:gap-10">
         <div className="flex items-center gap-4 py-3 md:py-4 px-4 md:px-6 rounded-2xl md:rounded-3xl bg-primary/5 border-2 border-primary/10">
            <div className="text-3xl md:text-4xl font-black text-primary">{currentCount}</div>
            <div className="h-8 md:h-10 w-0.5 bg-primary/20" />
            <div className="space-y-0.5">
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/70">Compras Registradas</p>
               <p className="text-[10px] md:text-xs font-bold text-muted-foreground">Progreso: {currentCount * 10}%</p>
            </div>
         </div>

         <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
            <div className="w-full flex-1 h-3 bg-muted/50 rounded-full overflow-hidden border-2 border-primary/5 p-0.5">
               <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000" 
                  style={{ width: `${currentCount * 10}%` }}
               />
            </div>
            
            <div className="flex items-center gap-3 self-end md:self-auto">
              <input
                type="checkbox"
                id="isVerified"
                checked={formData.isVerified || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, isVerified: e.target.checked })
                }
                className="w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 border-primary/20 text-primary focus:ring-primary transition-all cursor-pointer"
              />
              <Label htmlFor="isVerified" className="text-xs md:text-sm font-black uppercase tracking-widest cursor-pointer select-none">
                Verificado
              </Label>
            </div>
         </div>
      </div>

      <div className="space-y-4 md:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg shadow-primary/20" />
             <Label className="text-base md:text-lg font-black uppercase tracking-tight text-foreground">
               Registro de Slots (1 - 10)
             </Label>
          </div>
          <p className="text-[10px] md:text-xs font-bold text-muted-foreground opacity-60">Click en un slot para editar.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
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
                  group relative p-3 md:p-5 rounded-2xl md:rounded-[2rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden
                  ${isUnlocked 
                    ? "border-primary/20 bg-white dark:bg-black shadow-lg shadow-primary/5 hover:border-primary/50" 
                    : isNext 
                    ? "border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary" 
                    : "border-muted/20 bg-muted/5 grayscale opacity-30 cursor-not-allowed hover:opacity-50"}
                `}
              >
                <div className="flex justify-between items-center mb-2 md:mb-4">
                  <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-tighter ${isUnlocked ? "text-primary/70" : "text-muted-foreground"}`}>
                    S{i + 1}
                  </span>
                  {isUnlocked ? (
                    <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  ) : isNext ? (
                    <PlusCircle className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse" />
                  ) : null}
                </div>
                
                <div className="relative z-10 py-1">
                   <div className={`text-center text-sm md:text-xl font-black ${isUnlocked ? "text-foreground" : "text-muted-foreground/40"}`}>
                      {formData.purchaseDates?.[i] || "-- / --"}
                   </div>
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

      <div className="flex gap-3 md:gap-4 pt-6 md:pt-10 border-t border-primary/10">
        <Button 
          type="submit" 
          className="flex-1 md:flex-none rounded-xl md:rounded-2xl px-6 md:px-14 h-12 md:h-14 shadow-lg md:shadow-2xl shadow-primary/20 font-black text-base md:text-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          Guardar
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 md:flex-none rounded-xl md:rounded-2xl px-6 md:px-10 h-12 md:h-14 border-2 font-black text-base md:text-lg hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
