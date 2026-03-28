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
import { ArrowLeft, Plus, Users } from "lucide-react";

export default function CustomerBenefitsPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [adminPass, setAdminPass] = useState("");
  const [customers, setCustomers] = useState<CustomerPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CustomerPurchase>>({});
  const [isAdding, setIsAdding] = useState(false);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const loadCustomers = useCallback(async (pass: string) => {
    try {
      setLoading(true);
      const data = await fetchCustomers(pass);
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
      if (error instanceof Error && error.message.includes("401")) {
        window.localStorage.removeItem("admin_password");
        router.push("/admin/login");
      } else {
        toast.error("Error al cargar clientes");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const storedPass = window.localStorage.getItem("admin_password") || "";
    if (!storedPass) {
      router.push("/admin/login");
      return;
    }
    setAdminPass(storedPass);
    loadCustomers(storedPass);
  }, [router, loadCustomers]);

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
    if (!adminPass) return;
    
    try {
      // Clean up empty dates at the end if we want
      const cleanedDates = (formData.purchaseDates || [])
        .map(d => d.trim());
      
      const payload = { ...formData, purchaseDates: cleanedDates };

      if (editingId) {
        const updated = await updateCustomer(adminPass, editingId, payload);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingId ? updated : c))
        );
        toast.success("Cliente actualizado");
      } else {
        // Create new customer
        const res = await fetch("/api/admin/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPass,
          },
          body: JSON.stringify({
            name: payload.name,
            username: payload.username,
            purchases_count: payload.purchasesCount,
            is_verified: payload.isVerified,
            purchase_dates: payload.purchaseDates,
          }),
        });
        if (!res.ok) throw new Error("Error creating customer");
        const data = await res.json();
        setCustomers((prev) => [...prev, data.customer]);
        toast.success("Cliente creado");
      }
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Error al guardar cliente");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!adminPass) return;
    if (!confirm("¿Estás seguro de que querés eliminar este cliente?")) return;
    
    try {
      await deleteCustomer(adminPass, id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cliente eliminado");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error al eliminar cliente");
    }
  };

  if (!adminPass) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Gestión de Beneficios
            </h1>
            <p className="text-muted-foreground text-lg">
              Administrá los cupones y la lealtad de tus clientes.
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
              onClick={handleAddNew}
              className="gap-2 rounded-xl border-2 shadow-lg shadow-primary/10 font-bold"
            >
              <Plus className="w-4 h-4" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Search & Stats Bar placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Clientes</div>
                <Users className="w-4 h-4 text-primary/40" />
              </div>
              <div className="text-4xl font-black mt-1">{loading ? "..." : customers.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300">
            <CardContent className="pt-6">
               <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Verificados</div>
              <div className="text-4xl font-black mt-1 text-blue-500">
                {loading ? "..." : customers.filter(c => c.isVerified).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Completados (Full)</div>
              <div className="text-4xl font-black mt-1 text-green-500">
                {loading ? "..." : customers.filter(c => (c.purchasesCount || 0) >= 10).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Container with scroll ref */}
        <div ref={formRef}>
          {(isAdding || editingId) && (
            <Card className="border-2 border-primary/20 rounded-3xl shadow-2xl bg-white dark:bg-black overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                    {editingId ? "Editar Cliente" : "Registrar Nuevo Cliente"}
                  </h2>
                  <div className="h-1 flex-1 mx-4 bg-muted/30 rounded-full" />
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

        {/* Content Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
             <div className="w-2 h-8 bg-primary rounded-full" />
             <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Listado de Clientes</h2>
          </div>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-2 border-primary/5 rounded-2xl overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-7 w-32 bg-muted animate-pulse rounded-md" />
                      <div className="h-6 w-20 bg-muted animate-pulse rounded-md" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                      <div className="h-1.5 w-full bg-muted animate-pulse rounded-full" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-9 w-9 bg-muted animate-pulse rounded-lg" />
                      <div className="h-9 w-9 bg-muted animate-pulse rounded-lg" />
                      <div className="h-9 w-24 bg-muted animate-pulse rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-primary/10 rounded-[3rem] bg-white/30 dark:bg-black/30 backdrop-blur-sm">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <Plus className="w-12 h-12 text-primary/20" />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-2">No hay clientes aún</h3>
              <p className="text-muted-foreground max-w-sm text-center font-medium">
                Empezá registrando tu primer cliente para gestionar sus beneficios.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {customers.map((customer) => (
                <Card 
                  key={customer.id} 
                  className={`
                    hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-2 rounded-3xl group overflow-hidden bg-white dark:bg-black
                    ${editingId === customer.id ? "border-primary/30 ring-4 ring-primary/5" : "border-primary/5"}
                  `}
                >
                  <CardContent className="p-0">
                    <div className="p-7">
                      {editingId === customer.id ? (
                        <div className="flex flex-col items-center justify-center py-12 opacity-40">
                          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-3" />
                          <p className="text-sm font-bold uppercase tracking-widest">Editando...</p>
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
