import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import AdminWrapper from "./AdminWrapper"; // Az önce oluşturduğumuz dosya

export default async function AdminLayout({ children }) {
    // 1. Session Kontrolü (Server Side)
    const session = await getServerSession(authOptions);

    // 2. Güvenlik Duvarı
    if (!session?.user || session.user.role === 'customer') {
        redirect("/");
    }

    // 3. Client Wrapper'ı Çağır
    // Session verisini prop olarak gönderiyoruz ki sidebar'da kullanabilelim
    return (
        <AdminWrapper session={session}>
            {children}
        </AdminWrapper>
    );
}
