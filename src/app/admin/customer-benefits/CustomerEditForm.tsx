import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerPurchase } from "@/lib/customers";
import React from "react";
import { CalendarIcon, Sparkles } from "lucide-react";

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
  const handleDateChange = (index: number, value: string) => {
    const newDates = [...(formData.purchaseDates || [])];
    while (newDates.length < 10) newDates.push("");
    newDates[index] = value;
    setFormData({ ...formData, purchaseDates: newDates });
  };

  // Helper to format YYYY-MM-DD to DD/MM and vice versa for the input display
  // But wait, the user wants a calendar, so let's use input type="date"
  // If the user previously had "16/3", we need to handle it.
  
  return (
    <form onSubmit={onSave} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold uppercase opacity-70">Nombre Completo</Label>
          <Input
            className="h-11 rounded-xl border-2 focus:ring-primary/20"
            value={formData.name || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold uppercase opacity-70">Email</Label>
          <Input
            className="h-11 rounded-xl border-2 focus:ring-primary/20"
            type="email"
            value={formData.email || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="juan@ejemplo.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold uppercase opacity-70">Usuario / Slug</Label>
          <Input
            className="h-11 rounded-xl border-2 focus:ring-primary/20"
            value={formData.username || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                username: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
            placeholder="Ej: juan-perez"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="space-y-2">
          <Label className="text-sm font-bold uppercase opacity-70">Cantidad de Compras (0-10)</Label>
          <div className="flex items-center gap-4">
             <Input
                className="h-12 w-32 text-center text-xl font-black rounded-xl border-2 focus:ring-primary/20"
                type="number"
                value={formData.purchasesCount || 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    purchasesCount: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)),
                  })
                }
                min="0"
                max="10"
                required
              />
              <div className="text-muted-foreground font-medium">Progress: {((formData.purchasesCount || 0) * 10)}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3 pb-2 px-1">
          <input
            type="checkbox"
            id="isVerified"
            checked={formData.isVerified || false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                isVerified: e.target.checked,
              })
            }
            className="w-6 h-6 rounded-lg border-2 border-primary/20 text-primary focus:ring-primary transition-all cursor-pointer"
          />
          <Label htmlFor="isVerified" className="text-lg font-bold cursor-pointer select-none">
            Cliente Verificado <span className="text-blue-500 ml-1">★</span>
          </Label>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-black uppercase tracking-widest text-primary">
            Fechas de cada Compra (Slots 1 al 10)
          </Label>
          <div className="h-0.5 flex-1 mx-4 bg-muted/30 rounded-full" />
          <Sparkles className="w-4 h-4 text-primary opacity-40" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-2xl border-2 transition-all duration-300 relative ${
                i < (formData.purchasesCount || 0) 
                  ? "border-primary/20 bg-primary/5 shadow-sm" 
                  : "border-muted/50 opacity-40 bg-muted/5"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Slot {i + 1}</span>
                <CalendarIcon className={`w-3 h-3 ${i < (formData.purchasesCount || 0) ? "text-primary/60" : "text-muted-foreground"}`} />
              </div>
              
              <Input
                type="text"
                className={`text-center text-xs h-9 bg-transparent border-none focus-visible:ring-0 px-0 font-bold ${
                   i < (formData.purchasesCount || 0) ? "text-foreground" : "text-muted-foreground"
                }`}
                value={formData.purchaseDates?.[i] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleDateChange(i, e.target.value)
                }
                placeholder="-- --"
              />
              
              {/* Optional: Add a button or small date picker trigger here */}
              <input 
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const val = e.target.value; // YYYY-MM-DD
                  if (val) {
                    const [y, m, d] = val.split("-");
                    handleDateChange(i, `${d}/${m}`); // Store as DD/MM for legacy/simple view
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-primary/5">
        <Button 
          type="submit" 
          className="rounded-xl px-12 h-12 shadow-xl shadow-primary/20 font-black text-lg"
        >
          Guardar Cambios
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="rounded-xl px-8 h-12 border-2 font-bold"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
