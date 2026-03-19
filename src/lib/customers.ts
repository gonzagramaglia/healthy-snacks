export interface CustomerPurchase {
    id: string;
    customerName: string;
    purchasesCount: number;
    lastUpdated: string; // ISO string
    isVerified?: boolean;
    purchaseDates?: string[];
}

export const hardcodedCustomers: Record<string, CustomerPurchase> = {
    "gonza": {
        id: "2",
        customerName: "Gonza",
        purchasesCount: 10,
        lastUpdated: "2024-03-17T15:45:00Z",
        isVerified: true,
        purchaseDates: ["1/3", "3/3", "5/3", "7/3", "9/3", "11/3", "13/3", "15/3", "16/3", "17/3"]
    },
    "cochito": {
        id: "4",
        customerName: "Cochito",
        purchasesCount: 5,
        lastUpdated: new Date().toISOString(),
        isVerified: true,
        purchaseDates: ["12/3", "14/3", "15/3", "17/3", "18/3"]
    },
    "max": {
        id: "5",
        customerName: "Max",
        purchasesCount: 2,
        lastUpdated: new Date().toISOString(),
        isVerified: true,
        purchaseDates: ["16/3", "18/3"]
    },
    "ro": {
        id: "6",
        customerName: "Ro I.",
        purchasesCount: 5,
        lastUpdated: new Date().toISOString(),
        isVerified: true,
        purchaseDates: ["10/3", "12/3", "14/3", "16/3", "18/3"]
    },
    "adrian": {
        id: "7",
        customerName: "Adrián G.",
        purchasesCount: 1,
        lastUpdated: new Date().toISOString(),
        isVerified: true,
        purchaseDates: ["18/3"]
    }
};
