export interface CustomerPurchase {
    id: string;
    customerName: string;
    purchasesCount: number;
    lastUpdated: string; // ISO string
}

export const hardcodedCustomers: Record<string, CustomerPurchase> = {
    "lucas": {
        id: "1",
        customerName: "Lucas",
        purchasesCount: 7,
        lastUpdated: "2024-03-18T10:30:00Z"
    },
    "gonza": {
        id: "2",
        customerName: "Gonza",
        purchasesCount: 10,
        lastUpdated: "2024-03-17T15:45:00Z"
    },
    "ana": {
        id: "3",
        customerName: "Ana",
        purchasesCount: 3,
        lastUpdated: "2024-03-16T12:00:00Z"
    },
    "cochito": {
        id: "4",
        customerName: "Cochito",
        purchasesCount: 10,
        lastUpdated: new Date().toISOString()
    }
};
