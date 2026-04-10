"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomerEditForm } from "./CustomerEditForm";
import { CustomerCard } from "./CustomerCard";
import { useRouter } from "next/navigation";
import { 
  CustomerPurchase, 
  fetchCustomers, 
  updateCustomer, 
  deleteCustomer 
} from "@/lib/customers";
import { toast } from "sonner";
import { ArrowLeft, Plus, Users, Star, ShieldCheck } from "lucide-react";
import { dictionary, Language } from "@/lib/dictionary";

interface CustomerBenefitsProps {
  lang: Language;
}

export function CustomerBenefits({ lang }: CustomerBenefitsProps) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [customers, setCustomers] = useState<CustomerPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CustomerPurchase>>({});
  const [isAdding, setIsAdding] = useState(false);

  const t = (dictionary[lang] || dictionary["es"]).admin || dictionary["es"].admin;
  const baseUrl = lang === "en" ? "/en/admin" : "/admin";

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCustomers();
      setCustomers(data);
      setIsAdmin(true);
    } catch (error: unknown) {
      console.error("Error loading customers:", error);
      if (error instanceof Error && error.message.includes("401")) {
        router.push("/admin/login");
      } else {
        toast.error(lang === "es" ? "Error al cargar clientes" : "Error loading customers");
      }
    } finally {
      setLoading(false);
    }
  }, [router, lang]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleEditCustomer = (customer: CustomerPurchase) => {
    setEditingId(customer.id);
    const initialDates = [...(customer.purchaseDates || [])];
    while (initialDates.length < 10) initialDates.push("");
    setFormData({ ...customer, purchaseDates: initialDates });
    setIsAdding(false);
    scrollToForm();
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      username: "",
      purchasesCount: 0,
      isVerified: false,
      purchaseDates: Array(10).fill(""),
    });
    setIsAdding(true);
    scrollToForm();
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cleanedDates = (formData.purchaseDates || []).map(d => d.trim());
      const payload = { ...formData, purchaseDates: cleanedDates };

      if (editingId) {
        const updated = await updateCustomer(editingId, payload);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingId ? updated : c))
        );
        toast.success(lang === "es" ? "Cliente actualizado" : "Customer updated");
      } else {
        const res = await fetch("/api/admin/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            username: payload.username,
            purchases_count: payload.purchasesCount,
            is_verified: payload.isVerified,
            purchase_dates: payload.purchaseDates,
          }),
        });
        if (!res.ok) {
           const errData = await res.json().catch(() => ({}));
           throw new Error(errData.details || errData.error || "Error creating customer");
        }
        const data = await res.json();
        setCustomers((prev) => [...prev, data.customer]);
        toast.success(lang === "es" ? "Cliente creado" : "Customer created");
      }
      setEditingId(null);
      setIsAdding(false);
    } catch (error: unknown) {
      console.error("Save Error:", error);
      const message = error instanceof Error ? error.message : (lang === "es" ? "Error al guardar cliente" : "Error saving customer");
      toast.error(message);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const confirmMsg = lang === "es" ? "¿Estás seguro de que querés eliminar este cliente?" : "Are you sure you want to delete this customer?";
    if (!confirm(confirmMsg)) return;
    
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success(lang === "es" ? "Cliente eliminado" : "Customer deleted");
    } catch {
      toast.error(lang === "es" ? "Error al eliminar" : "Error deleting");
    }
  };

  if (!isAdmin && !loading) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground">
      <div className="max-w-6xl mx-auto p-4 md:p-10 pt-12 md:pt-20 space-y-6 md:space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-4">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tight text-foreground uppercase">
              {t.customer_benefits.split(" ")[0]} <span className="text-primary italic">{t.customer_benefits.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium opacity-80 decoration-primary underline-offset-4 decoration-2">
              {t.manage_loyalty}
            </p>
          </div>
          
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={() => router.push(baseUrl)}
              className="flex-1 md:flex-none h-11 md:h-12 gap-2 rounded-xl border-2 font-black text-xs md:text-sm uppercase tracking-widest hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.admin_panel_link}</span>
            </Button>
            <Button 
              onClick={handleAddNew}
              className="flex-1 md:flex-none h-11 md:h-12 gap-2 rounded-xl border-2 shadow-xl shadow-primary/10 font-black text-xs md:text-sm uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" />
              {t.new_customer}
            </Button>
          </div>
        </div>

        {/* Stats Section - 3 across on Mobile! */}
        <div className="grid grid-cols-3 gap-2 md:gap-8">
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-xl md:rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300 group">
            <CardContent className="p-2 md:p-8">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[7px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{t.customers}</div>
                <Users className="w-3 h-3 md:w-5 md:h-5 text-primary/30 group-hover:text-primary/60 transition-colors" />
              </div>
              <div className="text-xl md:text-5xl font-black tracking-tighter">{loading ? "..." : customers.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-xl md:rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300 group">
            <CardContent className="p-2 md:p-8">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[7px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{t.verified}</div>
                <ShieldCheck className="w-3 h-3 md:w-5 md:h-5 text-blue-500/30 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="text-xl md:text-5xl font-black tracking-tighter text-blue-500">
                {loading ? "..." : customers.filter(c => c.isVerified).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-xl md:rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300 group">
            <CardContent className="p-2 md:p-8">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[7px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{t.completed}</div>
                <Star className="w-3 h-3 md:w-5 md:h-5 text-green-500/30 group-hover:text-green-500 transition-colors" />
              </div>
              <div className="text-xl md:text-5xl font-black tracking-tighter text-green-500">
                {loading ? "..." : customers.filter(c => (c.purchasesCount || 0) >= 10).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Container */}
        <div ref={formRef} className="scroll-mt-10">
          {(isAdding || editingId) && (
            <Card className="border-2 border-primary/20 rounded-3xl md:rounded-[3rem] shadow-2xl bg-white dark:bg-black overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <CardContent className="p-5 md:p-12">
                <div className="flex justify-between items-center mb-6 md:mb-10">
                   <h2 className="text-xl md:text-3xl font-black text-foreground uppercase tracking-tight">
                    {editingId ? t.edit : t.new_customer}
                  </h2>
                   <div className="h-1.5 flex-1 mx-4 bg-primary/5 rounded-full" />
                </div>
                <CustomerEditForm
                  formData={formData}
                  setFormData={setFormData}
                  onCancel={() => {
                    setEditingId(null);
                    setIsAdding(false);
                  }}
                  onSave={handleSaveCustomer}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* List Section */}
        <div className="space-y-6 md:space-y-10">
          <div className="flex items-center gap-4">
             <div className="w-2 md:w-3 h-8 md:h-12 bg-primary rounded-full shadow-lg shadow-primary/20" />
             <h2 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tighter">{t.list_title}</h2>
          </div>
          
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-2 border-primary/5 rounded-[2rem] overflow-hidden bg-muted/20 animate-pulse h-48 md:h-64" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 border-2 border-dashed border-primary/10 rounded-[2.5rem] md:rounded-[4rem] bg-white/30 dark:bg-black/30 backdrop-blur-sm">
              <Star className="w-16 h-16 md:w-24 md:h-24 text-primary/10 mb-6 animate-bounce duration-[3000ms]" />
              <h3 className="text-2xl md:text-4xl font-black text-foreground mb-3 tracking-tight">{t.no_results}</h3>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:gap-8">
              {customers.map((customer) => (
                <Card 
                  key={customer.id} 
                  className={`
                    hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-2 rounded-[2rem] md:rounded-[2.5rem] group overflow-hidden bg-white dark:bg-black
                    ${editingId === customer.id ? "border-primary/30 ring-8 ring-primary/5" : "border-primary/5"}
                  `}
                >
                  <CardContent className="p-0">
                    <div className="p-6 md:p-10">
                      {editingId === customer.id ? (
                        <div className="flex flex-col items-center justify-center py-10 md:py-20 opacity-40">
                          <ShieldCheck className="w-12 h-12 text-primary animate-pulse mb-4" />
                          <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.5em]">{lang === "es" ? "Editando..." : "Editing..."}</p>
                        </div>
                      ) : (
                        <CustomerCard
                          customer={customer}
                          onEdit={handleEditCustomer}
                          onDelete={handleDeleteCustomer}
                        />
                      )}
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
