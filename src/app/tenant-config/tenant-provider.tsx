import {ReactNode, useEffect, useState} from "react";
import { createContext } from 'react';
import Loading from "@/app/portal/reports/loading";


export const TenantContext = createContext({});

export function TenantProvider({ children }: { children: ReactNode }) {
    const [tenantData, setTenantData] = useState(null);

    useEffect(() => {
        const subdomain = window.location.hostname.split('.')[0];

        fetch(`/api/tenant-config?subdomain=${subdomain}`)
            .then(res => res.json())
            .then(setTenantData);
    }, []);

    if (!tenantData) return <Loading />;

    return (
        <TenantContext.Provider value={tenantData}>
            {children}
        </TenantContext.Provider>
    );
}
