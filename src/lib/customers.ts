export interface CustomerPurchase {
  id: string;
  name: string;
  email?: string;
  username: string;
  purchasesCount: number;
  lastUpdated: string; // ISO string
  isVerified?: boolean;
  purchaseDates?: string[];
}

interface RawCustomerData {
  id: string;
  name: string;
  email?: string;
  username: string;
  purchases_count: number;
  last_updated: string;
  is_verified?: boolean;
  purchase_dates?: string[];
}

export async function fetchCustomers(query = ""): Promise<CustomerPurchase[]> {
  const res = await fetch(`/api/admin/customers?q=${query}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.details || "Failed to fetch customers");
  }
  const data = await res.json();
  return (data.customers || []).map((c: RawCustomerData) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    username: c.username,
    purchasesCount: c.purchases_count,
    lastUpdated: c.last_updated,
    isVerified: c.is_verified,
    purchaseDates: c.purchase_dates,
  }));
}

export async function updateCustomer(id: string, customer: Partial<CustomerPurchase>): Promise<CustomerPurchase> {
  const res = await fetch(`/api/admin/customers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: customer.name,
      email: customer.email,
      username: customer.username,
      purchases_count: customer.purchasesCount,
      is_verified: customer.isVerified,
      purchase_dates: customer.purchaseDates,
    }),
  });
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.details || errData.error || "Failed to update customer");
  }
  
  const data = await res.json();
  const c: RawCustomerData = data.customer;
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    username: c.username,
    purchasesCount: c.purchases_count,
    lastUpdated: c.last_updated,
    isVerified: c.is_verified,
    purchaseDates: c.purchase_dates,
  };
}

export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`/api/admin/customers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to delete customer");
}
