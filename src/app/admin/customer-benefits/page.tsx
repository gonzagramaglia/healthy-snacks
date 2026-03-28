"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { ArrowLeft, Plus } from "lucide-react";

export default function CustomerBenefitsPage() {
  const router = useRouter();
  const [adminPass, setAdminPass] = useState("");
  const [customers, setCustomers] = useState<CustomerPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CustomerPurchase>>({});
  const [isAdding, setIsAdding] = useState(false);

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
    setFormData({ ...customer });
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: "",
      username: "",
      purchasesCount: 0,
      isVerified: false,
      purchaseDates: [],
    });
    setIsAdding(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPass) return;
    
    try {
      if (editingId) {
        const updated = await updateCustomer(adminPass, editingId, formData);
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
            name: formData.name,
            username: formData.username,
            purchases_count: formData.purchasesCount,
            is_verified: formData.isVerified,
            purchase_dates: formData.purchaseDates,
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
              Clientes y Beneficios
            </h1>
            <p className="text-muted-foreground text-lg">
              Gestioná los puntos de lealtad y verificación de tus clientes.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push("/admin")}
              className="gap-2 rounded-xl border-2 hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4" />
              Panel Admin
            </Button>
            <Button 
              onClick={handleAddNew}
              className="gap-2 rounded-xl border-2 shadow-lg shadow-primary/10"
            >
              <Plus className="w-4 h-4" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Form for adding/editing */}
        {(isAdding || editingId) && (
          <Card className="border-2 border-primary/20 rounded-2xl shadow-xl bg-white dark:bg-black overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? "Editar Cliente" : "Registrar Nuevo Cliente"}
              </h2>
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

        {/* Search & Stats Bar placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Clientes</div>
              <div className="text-3xl font-bold mt-1">{loading ? "..." : customers.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verificados</div>
              <div className="text-3xl font-bold mt-1">
                {loading ? "..." : customers.filter(c => c.isVerified).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-primary/5 rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Última Actividad</div>
              <div className="text-xl font-bold mt-2">
                {loading ? "..." : "Hoy"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div>
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
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-primary/10 rounded-3xl bg-white/30 dark:bg-black/30 backdrop-blur-sm">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <Plus className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No se encontraron clientes</h3>
              <p className="text-muted-foreground max-w-sm text-center">
                Parece que todavía no hay clientes registrados. Aparecerán aquí cuando empiecen a interactuar con el sistema.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {customers.map((customer) => (
                <Card 
                  key={customer.id} 
                  className="hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-2 border-primary/5 rounded-2xl group overflow-hidden bg-white dark:bg-black"
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                    {editingId === customer.id ? (
                      <div className="flex flex-col items-center justify-center py-10 opacity-50">
                         <p className="text-sm font-medium">Editando arriba...</p>
                      </div>
                    ) : (
                      <CustomerCard
                        customer={customer}
                        onEdit={handleEditCustomer}
                        onDelete={handleDeleteCustomer}
                      />
                    )}
                    </div>
                    {/* Visual accent at the bottom */}
                    {!editingId && (
                      <div className="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500 opacity-60" />
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
