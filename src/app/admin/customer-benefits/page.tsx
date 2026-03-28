"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Trash2, Edit2, CheckCircle2, XCircle } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  username: string;
  purchases_count: number;
  is_verified: boolean;
  last_updated: string;
  created_at: string;
};

type CustomerForm = {
  name: string;
  username: string;
  purchases_count: number;
  is_verified: boolean;
};

export default function CustomerBenefitsPage() {
  const router = useRouter();
  const [adminPass, setAdminPass] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerForm>({
    name: "",
    username: "",
    purchases_count: 0,
    is_verified: true,
  });

  const fetchCustomers = useCallback(
    async (pass?: string, query?: string) => {
      const currentPass = pass || adminPass;
      if (!currentPass) return;

      setLoading(true);
      setError(null);
      try {
        const url = new URL("/api/admin/customers", window.location.origin);
        if (query) url.searchParams.set("q", query);

        const res = await fetch(url.toString(), {
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
        if (!res.ok) throw new Error(data.error || "Failed to load customers");
        setCustomers(data.customers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load customers");
      } finally {
        setLoading(false);
      }
    },
    [adminPass, router],
  );

  useEffect(() => {
    const checkAuth = async () => {
      const storedPass = window.localStorage.getItem("admin_password") || "";
      if (!storedPass) {
        router.push("/admin/login");
        return;
      }

      setAdminPass(storedPass);
      await fetchCustomers(storedPass);
    };

    checkAuth();
  }, [router, fetchCustomers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(adminPass, searchQuery);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/customers/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPass,
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update customer");
      } else {
        const res = await fetch("/api/admin/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": adminPass,
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create customer");
      }

      setFormData({
        name: "",
        username: "",
        purchases_count: 0,
        is_verified: true,
      });
      setShowForm(false);
      setEditingId(null);
      await fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) return;

    setError(null);
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPass,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete customer");
      await fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete customer");
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setFormData({
      name: customer.name,
      username: customer.username,
      purchases_count: customer.purchases_count,
      is_verified: customer.is_verified,
    });
    setEditingId(customer.id);
    setShowForm(true);
  };

  if (!adminPass) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Administrar Beneficios</h1>
            <p className="text-muted-foreground mt-2">
              Gestioná los puntos y cupones de fidelidad de tus clientes recurrentes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              ← Volver
            </Button>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  name: "",
                  username: "",
                  purchases_count: 0,
                  is_verified: true,
                });
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-2">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <Input 
                    placeholder="Buscar por nombre o usuario..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="secondary">
                    <Search className="w-4 h-4" />
                </Button>
            </form>
        </div>

        {showForm && (
          <Card className="mb-6 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>
                {editingId ? "Editar Cliente" : "Crear Cliente"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCustomer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre Completo</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                  </div>
                  <div>
                    <Label>Usuario / Slug (en la URL)</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) =>
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
                      value={formData.purchases_count}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purchases_count: parseInt(e.target.value) || 0,
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
                        id="is_verified"
                        checked={formData.is_verified}
                        onChange={(e) =>
                        setFormData({
                            ...formData,
                            is_verified: e.target.checked,
                        })
                        }
                        className="w-4 h-4"
                    />
                    <Label htmlFor="is_verified">Cliente Verificado (Badge Azul)</Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">Guardar Cambios</Button>
                  <Button
                    type="button"
                    variant="outline"
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

        {loading ? (
          <div className="text-center py-10">Cargando clientes...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
            No se encontraron clientes. ¿Querés crear el primero?
          </div>
        ) : (
          <div className="grid gap-4">
            {customers.map((customer) => (
              <Card key={customer.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{customer.name}</h3>
                        {customer.is_verified ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          @{customer.username}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Compras: <span className="font-bold text-primary">{customer.purchases_count}/10</span>
                      </p>
                      
                      {/* Barrita de progreso visual */}
                      <div className="w-full max-w-xs bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-500" 
                            style={{ width: `${(customer.purchases_count / 10) * 100}%` }}
                          />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => window.open(`/u/${customer.username}`, '_blank')}
                      >
                        Ver Tarjeta
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
