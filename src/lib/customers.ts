export interface CustomerPurchase {
  id: string;
  name: string;
  username: string;
  purchasesCount: number;
  lastUpdated: string; // ISO string
  isVerified?: boolean;
  purchaseDates?: string[];
}

export async function fetchCustomers(adminPassword: string, query = ""): Promise<CustomerPurchase[]> {
  const res = await fetch(`/api/admin/customers?q=${query}`, {
    headers: {
      "x-admin-password": adminPassword,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch customers");
  const data = await res.json();
  return (data.customers || []).map((c: { 
    id: string; 
    name: string; 
    username: string; 
    purchases_count: number; 
    last_updated: string; 
    is_verified: boolean; 
    purchase_dates: string[]; 
  }) => ({
    id: c.id,
    name: c.name,
    username: c.username,
    purchasesCount: c.purchases_count,
    lastUpdated: c.last_updated,
    isVerified: c.is_verified,
    purchaseDates: c.purchase_dates,
  }));
}

export async function updateCustomer(adminPassword: string, id: string, customer: Partial<CustomerPurchase>): Promise<CustomerPurchase> {
  const res = await fetch(`/api/admin/customers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify({
      name: customer.name,
      username: customer.username,
      purchases_count: customer.purchasesCount,
      is_verified: customer.isVerified,
      purchase_dates: customer.purchaseDates,
    }),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  const data = await res.json();
  const c = data.customer;
  return {
    id: c.id,
    name: c.name,
    username: c.username,
    purchasesCount: c.purchases_count,
    lastUpdated: c.last_updated,
    isVerified: c.is_verified,
    purchaseDates: c.purchase_dates,
  };
}

export async function deleteCustomer(adminPassword: string, id: string): Promise<void> {
  const res = await fetch(`/api/admin/customers/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-password": adminPassword,
    },
  });
  if (!res.ok) throw new Error("Failed to delete customer");
}
