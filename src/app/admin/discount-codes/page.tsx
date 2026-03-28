"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  XCircle,
  ExternalLink
} from "lucide-react";

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

export default function CouponsPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [adminPass, setAdminPass] = useState("");
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

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const fetchCoupons = useCallback(
    async (pass?: string) => {
      const currentPass = pass || adminPass;
      if (!currentPass) return;

      setLoading(true);
      try {
        const res = await fetch("/api/admin/discount-codes", {
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": currentPass,
          },
        });

        if (res.status === 401) {
          window.localStorage.removeItem("admin_password");
          router.push("/admin/login");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load coupons");
        setCoupons(data.coupons || []);
      } catch (err) {
        toast.error("Error al cargar cupones");
      } finally {
        setLoading(false);
      }
    },
    [adminPass, router],
  );

  useEffect(() => {
    const storedPass = window.localStorage.getItem("admin_password") || "";
    if (!storedPass) {
      router.push("/admin/login");
      return;
    }
    setAdminPass(storedPass);
    fetchCoupons(storedPass);
  }, [router, fetchCoupons]);

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/discount-codes/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPass,
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update coupon");
        toast.success("Código actualizado");
      } else {
        const res = await fetch("/api/admin/discount-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPass,
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create coupon");
        toast.success("Código creado");
      }

      setShowForm(false);
      setEditingId(null);
      await fetchCoupons();
    } catch (err) {
      toast.error("Error al guardar el código");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar este código?")) return;

    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPass,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete coupon");
      toast.success("Código eliminado");
      await fetchCoupons();
    } catch (err) {
      toast.error("Error al eliminar");
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

  if (!adminPass) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Códigos de Descuento
            </h1>
            <p className="text-muted-foreground text-lg">
              Creá y gestioná cupones promocionales (ej: OFF10).
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push("/admin")}
              className="gap-2 rounded-xl border-2 hover:bg-muted font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              Panel Admin
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
              className="gap-2 rounded-xl border-2 shadow-lg shadow-primary/10 font-bold"
            >
              <Plus className="w-4 h-4" />
              Nuevo Código
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Códigos</div>
                <Ticket className="w-4 h-4 text-primary/40" />
              </div>
              <div className="text-4xl font-black mt-1">{loading ? "..." : coupons.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300">
            <CardContent className="pt-6">
               <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Activos</div>
              <div className="text-4xl font-black mt-1 text-green-500">
                {loading ? "..." : coupons.filter(c => c.active).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Uso Total</div>
              <div className="text-4xl font-black mt-1 text-primary">
                {loading ? "..." : coupons.reduce((acc, c) => acc + c.used_count, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Container */}
        <div ref={formRef}>
          {showForm && (
            <Card className="border-2 border-primary/20 rounded-3xl shadow-2xl bg-white dark:bg-black overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                    {editingId ? "Editar Código" : "Crear Nuevo Código"}
                  </h2>
                  <div className="h-1 flex-1 mx-4 bg-muted/30 rounded-full" />
                </div>
                
                <form onSubmit={handleSaveCoupon} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Label className="text-sm font-bold uppercase opacity-70">Código (Ej: VERANO20)</Label>
                       <Input
                         className="h-12 text-xl font-mono font-bold rounded-xl border-2 focus:ring-primary/20 uppercase"
                         value={formData.code}
                         onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                         placeholder="OFF50"
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-sm font-bold uppercase opacity-70">Tipo de Descuento</Label>
                       <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={formData.type === "percentage" ? "default" : "outline"}
                            className="h-12 rounded-xl transition-all font-bold"
                            onClick={() => setFormData({...formData, type: "percentage"})}
                          >
                            <Percent className="w-4 h-4 mr-2" />
                            Porcentaje
                          </Button>
                          <Button
                            type="button"
                            variant={formData.type === "fixed" ? "default" : "outline"}
                            className="h-12 rounded-xl transition-all font-bold"
                            onClick={() => setFormData({...formData, type: "fixed"})}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Monto Fijo
                          </Button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                       <Label className="text-sm font-bold uppercase opacity-70">Valor</Label>
                       <Input
                         type="number"
                         className="h-11 rounded-xl border-2 font-bold"
                         value={formData.value}
                         onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-sm font-bold uppercase opacity-70">Tope Máx ($)</Label>
                       <Input
                         type="number"
                         className="h-11 rounded-xl border-2"
                         value={formData.max_discount ?? ""}
                         onChange={(e) => setFormData({...formData, max_discount: e.target.value ? parseFloat(e.target.value) : null})}
                         placeholder="Sin tope"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-sm font-bold uppercase opacity-70">Mín. Compra ($)</Label>
                       <Input
                         type="number"
                         className="h-11 rounded-xl border-2"
                         value={formData.min_subtotal ?? ""}
                         onChange={(e) => setFormData({...formData, min_subtotal: e.target.value ? parseFloat(e.target.value) : null})}
                         placeholder="Sin mínimo"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-sm font-bold uppercase opacity-70">Límite Uso</Label>
                       <Input
                         type="number"
                         className="h-11 rounded-xl border-2"
                         value={formData.usage_limit ?? ""}
                         onChange={(e) => setFormData({...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null})}
                         placeholder="∞ Ilimitado"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-2">
                       <Label className="text-sm font-bold uppercase opacity-70">Email Permitido (Opcional)</Label>
                       <Input
                         type="email"
                         className="h-11 rounded-xl border-2"
                         value={formData.allowed_email ?? ""}
                         onChange={(e) => setFormData({...formData, allowed_email: e.target.value || null})}
                         placeholder="solo-este-usuario@gmail.com"
                       />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                       <input
                         type="checkbox"
                         id="active-form"
                         checked={formData.active}
                         onChange={(e) => setFormData({...formData, active: e.target.checked})}
                         className="w-6 h-6 rounded-lg border-2 border-primary/20 text-primary transition-all"
                       />
                       <Label htmlFor="active-form" className="text-lg font-bold cursor-pointer">
                         Código Activo
                       </Label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-primary/5">
                    <Button type="submit" className="h-12 px-10 rounded-xl font-bold text-lg shadow-xl shadow-primary/20">
                      {editingId ? "Guardar Cambios" : "Crear Código"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-12 px-10 rounded-xl font-bold border-2"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
             <div className="w-2 h-8 bg-primary rounded-full" />
             <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Códigos Disponibles</h2>
          </div>

          {loading ? (
             <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-2 border-primary/5 rounded-2xl overflow-hidden h-48 animate-pulse bg-muted/20" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-primary/10 rounded-[3rem] bg-white/30 dark:bg-black/30 backdrop-blur-sm">
               <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <Ticket className="w-12 h-12 text-primary/20" />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-2">No hay códigos aún</h3>
              <p className="text-muted-foreground text-center font-medium">Presioná + Nuevo Código para empezar.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {coupons.map((coupon) => (
                <Card 
                  key={coupon.id} 
                  className={`
                    group border-2 rounded-[2rem] overflow-hidden bg-white dark:bg-black transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5
                    ${!coupon.active ? "opacity-60 grayscale" : "border-primary/5"}
                  `}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <h3 className="text-3xl font-black tracking-tighter text-foreground font-mono">{coupon.code}</h3>
                           {coupon.active ? (
                             <CheckCircle2 className="w-5 h-5 text-green-500" />
                           ) : (
                             <XCircle className="w-5 h-5 text-red-400" />
                           )}
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 w-fit px-2 py-0.5 rounded">
                          {coupon.type === "percentage" ? "Porcentaje" : "Monto Fijo"}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCoupon(coupon)} className="rounded-xl hover:bg-primary/10 hover:text-primary">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCoupon(coupon.id)} className="rounded-xl hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                       <div className="space-y-4">
                          <div className="text-4xl font-black text-primary">
                             {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                             {coupon.max_discount && <span className="text-sm font-bold text-muted-foreground ml-2 opacity-60">Tope: ${coupon.max_discount}</span>}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider">Usados</p>
                                <p className="font-black flex items-center gap-1.5">
                                  <History className="w-3 h-3 opacity-40" />
                                  {coupon.used_count} <span className="text-muted-foreground/40 font-bold">/ {coupon.usage_limit || "∞"}</span>
                                </p>
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider">Mín. Compra</p>
                                <p className="font-black">${coupon.min_subtotal || 0}</p>
                             </div>
                          </div>
                       </div>

                       <div className="h-20 w-20 bg-primary/5 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                          <Ticket className="w-10 h-10 text-primary/20" />
                       </div>
                    </div>

                    {coupon.allowed_email && (
                      <div className="mt-6 pt-4 border-t border-primary/5 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <ExternalLink className="w-3 h-3" />
                         Solo para: <span className="text-foreground">{coupon.allowed_email}</span>
                      </div>
                    )}
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
