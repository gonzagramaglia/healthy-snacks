"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerEditForm } from "./CustomerEditForm";
import { CustomerCard } from "./CustomerCard";
import { 
  CustomerPurchase, 
  fetchCustomers, 
  updateCustomer, 
  deleteCustomer 
} from "@/lib/customers";
import { toast } from "sonner";

export default function CustomerBenefitsPage() {
  const [customers, setCustomers] = useState<CustomerPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CustomerPurchase>>({});

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
      toast.error("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (customer: CustomerPurchase) => {
    setEditingId(customer.id);
    setFormData({ ...customer });
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;
    
    try {
      const updated = await updateCustomer(formData.id, formData);
      setCustomers((prev) =>
        prev.map((c) => (c.id === formData.id ? updated : c))
      );
      setEditingId(null);
      toast.success("Cliente actualizado");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Error al actualizar cliente");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("¿Estás seguro de que querés eliminar este cliente?")) return;
    
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cliente eliminado");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error al eliminar cliente");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
            <div className="text-lg text-muted-foreground">Cargando clientes...</div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
            No se encontraron clientes.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {customers.map((customer) => (
              <Card key={customer.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  {editingId === customer.id ? (
                    <CustomerEditForm
                      formData={formData}
                      setFormData={setFormData}
                      onCancel={() => setEditingId(null)}
                      onSave={handleSaveCustomer}
                    />
                  ) : (
                    <CustomerCard
                      customer={customer}
                      onEdit={handleEditCustomer}
                      onDelete={handleDeleteCustomer}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
