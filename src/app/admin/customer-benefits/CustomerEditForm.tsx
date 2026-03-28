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
  return (
    <form onSubmit={onSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nombre Completo</Label>
          <Input
            value={formData.name || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>
        <div>
          <Label>Usuario / Slug (en la URL)</Label>
          <Input
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Cantidad de Compras (0-10)</Label>
          <Input
            type="number"
            value={formData.purchasesCount || 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                purchasesCount: parseInt(e.target.value) || 0,
              })
            }
            min="0"
            max="10"
            required
          />
        </div>
        <div className="flex items-center gap-2 pt-8">
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
            className="w-4 h-4"
          />
          <Label htmlFor="isVerified">Cliente Verificado (Badge Azul)</Label>
        </div>
      </div>
      <div>
        <Label>Fechas de compras (separadas por coma)</Label>
        <Input
          type="text"
          value={formData.purchaseDates?.join(", ") || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({
              ...formData,
              purchaseDates: e.target.value
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean),
            })
          }
          placeholder="Ej: 1/3, 3/3, 5/3"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit">Guardar Cambios</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
