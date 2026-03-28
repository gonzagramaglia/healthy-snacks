import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Edit2, Trash2 } from "lucide-react";
import React from "react";
import { CustomerPurchase } from "@/lib/customers";

interface CustomerCardProps {
  customer: CustomerPurchase;
  onEdit: (customer: CustomerPurchase) => void;
  onDelete: (id: string) => void;
}

export function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold">{customer.name}</h3>
          {customer.isVerified ? (
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          ) : (
            <XCircle className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
            @{customer.username}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Compras:{" "}
          <span className="font-bold text-primary">
            {customer.purchasesCount}/10
          </span>
        </p>
        {customer.purchaseDates && customer.purchaseDates.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            Fechas: {customer.purchaseDates.join(", ")}
          </div>
        )}
        {/* Barrita de progreso visual */}
        <div className="w-full max-w-xs bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${(customer.purchasesCount / 10) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <Button variant="ghost" size="icon" onClick={() => onEdit(customer)}>
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(customer.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open(`/u/${customer.username}`, "_blank")}
        >
          Ver Tarjeta
        </Button>
      </div>
    </div>
  );
}
