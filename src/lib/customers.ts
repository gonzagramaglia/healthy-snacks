export interface CustomerPurchase {
    id: string;
    customerName: string;
    purchasesCount: number;
    lastUpdated: string; // ISO string
    isVerified?: boolean;
}

export const hardcodedCustomers: Record<string, CustomerPurchase> = {
    "lucas": {
        id: "1",
        customerName: "Lucas",
        purchasesCount: 7,
        lastUpdated: "2024-03-18T10:30:00Z",
        isVerified: false
    },
    "gonza": {
        id: "2",
        customerName: "Gonza",
        purchasesCount: 10,
        lastUpdated: "2024-03-17T15:45:00Z",
        isVerified: true
    },
    "ana": {
        id: "3",
        customerName: "Ana",
        purchasesCount: 3,
        lastUpdated: "2024-03-16T12:00:00Z",
        isVerified: false
    },
    "cochito": {
        id: "4",
        customerName: "Cochito",
        purchasesCount: 5,
        lastUpdated: new Date().toISOString(),
        isVerified: true
    },
    "max": {
        id: "5",
        customerName: "Max",
        purchasesCount: 2,
        lastUpdated: new Date().toISOString(),
        isVerified: true
    },
    "ro": {
        id: "6",
        customerName: "Ro I.",
        purchasesCount: 5,
        lastUpdated: new Date().toISOString(),
        isVerified: true
    },
    "adrian": {
        id: "7",
        customerName: "Adrián G.",
        purchasesCount: 1,
        lastUpdated: new Date().toISOString(),
        isVerified: true
    }
};
