import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerPurchase } from "@/lib/customers";
import React from "react";

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
    // Ensure the array has enough length
    while (newDates.length < 10) newDates.push("");
    newDates[index] = value;
    
    // Filter out trailing empty strings if we want to keep it clean, 
    // but the user wants to see 10 fields, so let's keep them and only filter on save if needed.
    setFormData({ ...formData, purchaseDates: newDates });
  };

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Nombre Completo</Label>
          <Input
            className="rounded-xl border-2 focus:ring-primary/20"
            value={formData.name || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Email</Label>
          <Input
            className="rounded-xl border-2 focus:ring-primary/20"
            type="email"
            value={formData.email || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="juan@ejemplo.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Usuario / Slug</Label>
          <Input
            className="rounded-xl border-2 focus:ring-primary/20"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Cantidad de Compras (0-10)</Label>
          <Input
            className="rounded-xl border-2 focus:ring-primary/20"
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
            className="w-5 h-5 rounded-md border-2 border-primary/20 text-primary focus:ring-primary"
          />
          <Label htmlFor="isVerified" className="text-sm font-medium cursor-pointer">
            Cliente Verificado (Badge Azul)
          </Label>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-bold uppercase tracking-wider text-primary/80">
          Fechas de cada Compra (Slots 1 al 10)
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                Slot {i + 1}
              </Label>
              <Input
                className={`text-center text-xs h-9 rounded-lg border-2 transition-all ${
                  i < (formData.purchasesCount || 0) 
                    ? "border-primary/30 bg-primary/5 font-bold" 
                    : "border-muted/50 opacity-60"
                }`}
                value={formData.purchaseDates?.[i] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleDateChange(i, e.target.value)
                }
                placeholder="---"
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          * Podés ingresar fechas (ej: 12/03) o marcas personalizadas para cada slot.
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-primary/5">
        <Button 
          type="submit" 
          className="rounded-xl px-8 shadow-lg shadow-primary/20 font-bold"
        >
          Guardar Cambios
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="rounded-xl px-8 border-2"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
