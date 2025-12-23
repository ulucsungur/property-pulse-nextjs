import PropertyAddForm from "@/components/PropertyAddForm";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions'; // veya senin yolun neresiyse
import { redirect } from 'next/navigation';

const AddPropertyPage = async () => {
    // 1. Oturumu Çek
    const session = await getServerSession(authOptions);

    // 2. Kontrol Et: Giriş yapmamışsa VEYA rolü 'customer' ise
    if (!session || session.user.role === 'customer') {
        // Ana sayfaya (veya login'e) şutla
        redirect('/');
    }
    return (
        <section className="bg-blue-50 dark:bg-gray-900 min-h-screen">
            <div className="container m-auto max-w-2xl py-24">
                <div className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 dark:border-gray-700 m-4 md:m-0">
                    <PropertyAddForm />
                </div>
            </div>
        </section>);
}

export default AddPropertyPage;
