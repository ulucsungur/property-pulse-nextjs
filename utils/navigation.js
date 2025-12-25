import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing'; // Az önce oluşturduğumuz dosyayı kullanıyoruz

// Link, redirect, usePathname ve useRouter'ı oluşturup dışarı aktar
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
