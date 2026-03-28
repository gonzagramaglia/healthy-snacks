import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Edit2, Trash2, Mail, User, History, ExternalLink } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-black tracking-tight">{customer.name}</h3>
            {customer.isVerified && (
              <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-7 h-7 rounded-full border border-blue-100 dark:border-blue-800 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="w-4 h-4 opacity-40" />
              <span className="text-foreground/80 font-bold font-mono">@{customer.username}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="w-4 h-4 opacity-40" />
                <span className="text-foreground/80">{customer.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto self-start">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(customer)}
            className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all overflow-hidden"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-all overflow-hidden"
            onClick={() => onDelete(customer.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-2 font-bold px-4 gap-2 h-10 shadow-sm"
            onClick={() => window.open(`/u/${customer.username}`, "_blank")}
          >
            Ver Tarjeta
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-primary/5">
        <div className="flex justify-between items-end">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Progreso de Lealtad</p>
              <div className="text-3xl font-black text-primary">
                {customer.purchasesCount}<span className="text-muted-foreground font-medium text-xl"> / 10</span>
              </div>
           </div>
           {customer.purchaseDates && customer.purchaseDates.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-xl">
                 <History className="w-3.5 h-3.5 opacity-40" />
                 Historial Activo
              </div>
           )}
        </div>

        <div className="relative pt-2">
          <div className="w-full bg-muted/50 h-3 rounded-full overflow-hidden border border-primary/5 shadow-inner">
            <div
              className={`h-full transition-all duration-1000 ease-out rounded-full shadow-lg ${
                customer.purchasesCount >= 10 
                  ? "bg-gradient-to-r from-green-500 to-emerald-400 shadow-green-500/20" 
                  : "bg-gradient-to-r from-primary to-primary/60 shadow-primary/20"
              }`}
              style={{ width: `${(customer.purchasesCount / 10) * 100}%` }}
            />
          </div>
          {/* Slot separators/markers could be added here for extra premium feel */}
        </div>
      </div>
    </div>
  );
}
