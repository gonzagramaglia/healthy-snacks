import { MainContent } from "@/components/MainContent";
import { hardcodedCustomers } from "@/lib/customers";
import { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ customerName: string }>
}): Promise<Metadata> {
    const { customerName } = await params;
    const customer = hardcodedCustomers[customerName.toLowerCase()];
    const name = customer ? customer.customerName : customerName.charAt(0).toUpperCase() + customerName.slice(1).toLowerCase();

    return {
        title: `Beneficios de ${name} ⚡ | Moovimiento`,
        description: `Consultá tus beneficios y compras realizadas en Moovimiento.`,
    };
}

export default async function CustomerPage({
    params
}: {
    params: Promise<{ customerName: string }>
}) {
    const { customerName } = await params;
    const customer = hardcodedCustomers[customerName.toLowerCase()] || {
        id: 'new',
        customerName: customerName.charAt(0).toUpperCase() + customerName.slice(1).toLowerCase(),
        purchasesCount: 0,
        lastUpdated: new Date().toISOString()
    };

    return <MainContent lang="es" customerData={customer} />;
}
