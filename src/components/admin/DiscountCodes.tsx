"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Plus, 
  Ticket, 
  Percent, 
  DollarSign, 
  History, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle
} from "lucide-react";
import { dictionary, Language } from "@/lib/dictionary";

type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  max_discount: number | null;
  min_subtotal: number | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  usage_limit: number | null;
  used_count: number;
  allowed_email: string | null;
  created_at: string;
  updated_at: string;
};

type CouponForm = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  max_discount: number | null;
  min_subtotal: number | null;
  active: boolean;
  usage_limit: number | null;
  allowed_email: string | null;
};

interface DiscountCodesProps {
  lang: Language;
}

export function DiscountCodes({ lang = "es" }: DiscountCodesProps) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CouponForm>({
    code: "",
    type: "percentage",
    value: 0,
    max_discount: null,
    min_subtotal: null,
    active: true,
    usage_limit: null,
    allowed_email: "",
  });

  const t = (dictionary[lang] || dictionary["es"]).admin || dictionary["es"].admin;
  const baseUrl = lang === "en" ? "/en/admin" : "/admin";

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const fetchCouponsList = useCallback(
    async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/discount-codes");

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load coupons");
        setCoupons(data.coupons || []);
      } catch (error: unknown) {
        console.error("Error loading coupons:", error);
        toast.error(lang === "es" ? "Error al cargar cupones" : "Error loading coupons");
      } finally {
        setLoading(false);
      }
    },
    [router, lang],
  );

  useEffect(() => {
    fetchCouponsList();
  }, [fetchCouponsList]);

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/discount-codes/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.details || data.error || "Failed to update coupon");
        toast.success(lang === "es" ? "Código actualizado" : "Code updated");
      } else {
        const res = await fetch("/api/admin/discount-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.details || data.error || "Failed to create coupon");
        toast.success(lang === "es" ? "Código creado" : "Code created");
      }

      setShowForm(false);
      setEditingId(null);
      await fetchCouponsList();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : (lang === "es" ? "Error al guardar el código" : "Error saving code");
      toast.error(message);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    const confirmMsg = lang === "es" ? "¿Estás seguro de que querés eliminar este código?" : "Are you sure you want to delete this code?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete coupon");
      toast.success(lang === "es" ? "Código eliminado" : "Code deleted");
      await fetchCouponsList();
    } catch {
      toast.error(lang === "es" ? "Error al eliminar" : "Error deleting");
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      max_discount: coupon.max_discount,
      min_subtotal: coupon.min_subtotal,
      active: coupon.active,
      usage_limit: coupon.usage_limit,
      allowed_email: coupon.allowed_email,
    });
    setEditingId(coupon.id);
    setShowForm(true);
    scrollToForm();
  };

  // Safe dictionary rendering with fallbacks
  const getHeaderTitle = () => {
    const text = t.discount_codes || "Códigos de Descuento";
    const parts = text.split(" ");
    return (
      <h1 className="text-5xl font-black tracking-tight text-foreground">
        {parts[0]} <span className="text-primary">{parts.slice(1).join(" ")}</span>
      </h1>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground">
      <div className="max-w-6xl mx-auto p-4 md:p-10 pt-12 md:pt-20 space-y-6 md:space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-1">
            {getHeaderTitle()}
            <p className="text-muted-foreground text-lg font-medium opacity-80">
              {(t.manage_coupons || "").replace("{code}", "OFF10")}
            </p>
          </div>
          
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={() => router.push(baseUrl)}
              className="flex-1 md:flex-none h-11 md:h-12 gap-2 rounded-xl border-2 font-black text-xs md:text-sm uppercase tracking-widest hover:bg-muted cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.admin_panel_link || "Panel Admin"}</span>
            </Button>
            <Button 
              onClick={() => {
                 setShowForm(true);
                 setEditingId(null);
                 setFormData({
                    code: "",
                    type: "percentage",
                    value: 0,
                    max_discount: null,
                    min_subtotal: null,
                    active: true,
                    usage_limit: null,
                    allowed_email: "",
                 });
                 scrollToForm();
              }}
              className="flex-1 md:flex-none h-11 md:h-12 gap-2 rounded-xl border-2 shadow-xl shadow-primary/10 font-black text-xs md:text-sm uppercase tracking-widest cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t.new_code || "Nuevo"}
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-2 md:gap-8">
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-xl md:rounded-3xl shadow-sm">
            <CardContent className="p-3 md:p-8">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[8px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{t.total_codes || "Total"}</div>
                <Ticket className="w-3 h-3 md:w-5 md:h-5 text-primary/30" />
              </div>
              <div className="text-xl md:text-5xl font-black tracking-tighter">{loading ? "..." : (coupons || []).length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-xl md:rounded-3xl shadow-sm">
            <CardContent className="p-3 md:p-8">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[8px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{t.active_codes || "Activos"}</div>
                <CheckCircle2 className="w-3 h-3 md:w-5 md:h-5 text-green-500/30" />
              </div>
              <div className="text-xl md:text-5xl font-black tracking-tighter text-green-500">
                {loading ? "..." : (coupons || []).filter(c => c.active).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-xl md:rounded-3xl shadow-sm">
            <CardContent className="p-3 md:p-8">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[8px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{t.total_usage || "Usos"}</div>
                <History className="w-3 h-3 md:w-5 md:h-5 text-primary/30" />
              </div>
              <div className="text-xl md:text-5xl font-black tracking-tighter text-primary">
                {loading ? "..." : (coupons || []).reduce((acc, c) => acc + (c.used_count || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Container */}
        <div ref={formRef} className="scroll-mt-10">
          {showForm && (
            <Card className="border-2 border-primary/20 rounded-3xl md:rounded-[3rem] shadow-2xl bg-white dark:bg-black overflow-hidden">
              <CardContent className="p-5 md:p-12">
                <div className="flex justify-between items-center mb-6 md:mb-10">
                   <h2 className="text-xl md:text-3xl font-black text-foreground uppercase tracking-tight">
                    {editingId ? (t.edit || "Editar") : (t.new_code || "Nuevo")}
                  </h2>
                   <div className="h-1.5 flex-1 mx-4 bg-primary/5 rounded-full" />
                </div>
                
                <form onSubmit={handleSaveCoupon} className="space-y-6 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-2 md:space-y-4">
                       <Label className="text-xs md:text-sm font-black uppercase tracking-widest opacity-60">{lang === "es" ? "Código" : "Code"} (Ej: VERANO20)</Label>
                       <Input
                         className="h-12 md:h-16 text-xl md:text-3xl font-black font-mono rounded-2xl border-2 focus:ring-primary/40 uppercase bg-muted/5 tracking-tighter"
                         value={formData.code}
                         onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                         placeholder="OFF50"
                         required
                       />
                    </div>
                    <div className="space-y-2 md:space-y-4">
                       <Label className="text-xs md:text-sm font-black uppercase tracking-widest opacity-60">{lang === "es" ? "Tipo de Descuento" : "Discount Type"}</Label>
                       <div className="grid grid-cols-2 gap-3 md:gap-4">
                          <Button
                            type="button"
                            variant={formData.type === "percentage" ? "default" : "outline"}
                            className="h-12 md:h-16 rounded-2xl transition-all font-black text-xs md:text-sm uppercase tracking-widest shadow-inner"
                            onClick={() => setFormData({...formData, type: "percentage"})}
                          >
                            <Percent className="w-4 h-4 mr-2" />
                            %
                          </Button>
                          <Button
                            type="button"
                            variant={formData.type === "fixed" ? "default" : "outline"}
                            className="h-12 md:h-16 rounded-2xl transition-all font-black text-xs md:text-sm uppercase tracking-widest shadow-inner"
                            onClick={() => setFormData({...formData, type: "fixed"})}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            {lang === "es" ? "Fijo" : "Fixed"}
                          </Button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    <div className="space-y-2">
                       <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">{lang === "es" ? "Valor" : "Value"}</Label>
                       <Input
                         type="number"
                         className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-black text-lg md:text-xl bg-muted/5"
                         value={formData.value}
                         onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">{lang === "es" ? "Tope Máx ($)" : "Max Cap ($)"}</Label>
                       <Input
                         type="number"
                         className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold bg-muted/5"
                         value={formData.max_discount ?? ""}
                         onChange={(e) => setFormData({...formData, max_discount: e.target.value ? parseFloat(e.target.value) : null})}
                         placeholder={lang === "es" ? "Sin tope" : "No cap"}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">{lang === "es" ? "Mín. Compra" : "Min. Purchase"}</Label>
                       <Input
                         type="number"
                         className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold bg-muted/5"
                         value={formData.min_subtotal ?? ""}
                         onChange={(e) => setFormData({...formData, min_subtotal: e.target.value ? parseFloat(e.target.value) : null})}
                         placeholder={lang === "es" ? "Sin mínimo" : "No min"}
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">{lang === "es" ? "Límite Uso" : "Usage Limit"}</Label>
                       <Input
                         type="number"
                         className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold bg-muted/5"
                         value={formData.usage_limit ?? ""}
                         onChange={(e) => setFormData({...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null})}
                         placeholder="∞"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-2">
                       <Label className="text-xs md:text-sm font-black uppercase tracking-widest opacity-60">{lang === "es" ? "Email Restringido" : "Restricted Email"} ({lang === "es" ? "Opcional" : "Optional"})</Label>
                       <Input
                         type="email"
                         className="h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold bg-muted/5"
                         value={formData.allowed_email ?? ""}
                         onChange={(e) => setFormData({...formData, allowed_email: e.target.value || null})}
                         placeholder="admin@moovimiento.com"
                       />
                    </div>
                    <div className="flex items-center gap-4 bg-muted/10 p-4 md:p-6 rounded-2xl border-2 border-primary/5">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            id="active-form"
                            checked={formData.active}
                            onChange={(e) => setFormData({...formData, active: e.target.checked})}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-lg border-2 border-primary/20 text-primary transition-all cursor-pointer focus:ring-primary/20"
                          />
                        </div>
                       <div className="space-y-0.5">
                          <Label htmlFor="active-form" className="text-base md:text-xl font-black cursor-pointer uppercase tracking-tight">
                            {lang === "es" ? "Código Activo" : "Code Active"}
                          </Label>
                          <p className="text-[10px] md:text-xs font-bold text-muted-foreground opacity-60 uppercase">{lang === "es" ? "Disponible para clientes" : "Available for customers"}</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8 border-t border-primary/10">
                    <Button 
                      type="submit" 
                      className="flex-1 md:flex-none h-12 md:h-16 px-8 md:px-14 rounded-xl md:rounded-[2rem] font-black text-base md:text-xl shadow-2xl shadow-primary/30 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="md:hidden">{t.save || "Guardar"}</span>
                      <span className="hidden md:inline">{editingId ? (t.save_changes || "Guardar") : (t.new_code || "Nuevo")}</span>
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 md:flex-none h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-[2rem] font-black text-base md:text-lg border-2 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                    >
                      {t.cancel || "Cancelar"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* List Section */}
        <div className="space-y-6 md:space-y-10">
          <div className="flex items-center gap-4">
             <div className="w-2 md:w-3 h-8 md:h-12 bg-primary rounded-full shadow-lg shadow-primary/20" />
             <h2 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tighter">{t.list_title || "Listado"}</h2>
          </div>

          {loading ? (
             <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-2 border-primary/5 rounded-[2rem] overflow-hidden h-48 md:h-64 animate-pulse bg-muted/20" />
              ))}
            </div>
          ) : (coupons || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 border-2 border-dashed border-primary/10 rounded-[2.5rem] md:rounded-[4rem] bg-white/30 dark:bg-black/30 backdrop-blur-sm">
              <Ticket className="w-16 h-16 md:w-24 md:h-24 text-primary/10 mb-6" />
              <h3 className="text-2xl md:text-4xl font-black text-foreground mb-3 tracking-tight">{t.no_results || "Nada por acá"}</h3>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:gap-8">
              {(coupons || []).map((coupon) => (
                <Card 
                  key={coupon.id} 
                  className={`
                    group border-2 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white dark:bg-black transition-all duration-500 hover:border-primary/40
                    ${!coupon.active ? "opacity-60 grayscale border-muted/20" : "border-primary/5"}
                    ${editingId === coupon.id ? "ring-8 ring-primary/5 border-primary/30" : ""}
                  `}
                >
                  <CardContent className="p-0">
                    <div className="p-6 md:p-10">
                      <div className="flex justify-between items-start mb-6 md:mb-10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                             <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-foreground font-mono uppercase bg-primary/5 px-3 py-1 rounded-xl">{coupon.code}</h3>
                             {coupon.active ? (
                               <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                               </div>
                             ) : (
                               <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500/10 rounded-full flex items-center justify-center text-red-400">
                                  <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                               </div>
                             )}
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-lg border border-primary/5">
                              {coupon.type === "percentage" ? (lang === "es" ? "Porcentual" : "Percentage") : (lang === "es" ? "Suma Fija" : "Fixed Amount")}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCoupon(coupon)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl">
                            <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCoupon(coupon.id)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl">
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-end justify-between gap-4">
                         <div className="space-y-6 flex-1">
                            <div className="text-4xl md:text-6xl font-black text-primary tracking-tighter leading-none mb-1">
                               {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                               {coupon.max_discount && <span className="text-sm md:text-lg font-bold text-muted-foreground/30 ml-3">MAX ${coupon.max_discount}</span>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-6">
                               <div className="space-y-1">
                                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">{lang === "es" ? "Uso" : "Usage"}</p>
                                  <p className="text-sm md:text-xl font-black tabular-nums">
                                    {coupon.used_count || 0} <span className="text-muted-foreground/20 font-bold">/ {coupon.usage_limit || "∞"}</span>
                                  </p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">{lang === "es" ? "Mínimo" : "Min"}</p>
                                  <p className="text-sm md:text-xl font-black tabular-nums">${coupon.min_subtotal || 0}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
