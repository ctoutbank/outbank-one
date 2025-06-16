import { cookies } from "next/headers";

type PageProps = {
    params: { id: string };
};

export default function SubdomainPage({ params }: PageProps) {
    const cookieStore = cookies();
    const subdomain = cookieStore.get("tenant")?.value || "desconhecido";

    return (
        <div style={{ padding: 32 }}>
            <h1>Página dinâmica</h1>
            <p><strong>Subdomínio:</strong> {subdomain}</p>
            <p><strong>ID:</strong> {params.id}</p>
        </div>
    );
}
