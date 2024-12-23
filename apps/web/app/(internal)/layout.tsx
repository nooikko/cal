import { AppSidebar } from '@/components/custom/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex flex-1'>
        <SidebarTrigger className='block md:hidden' />
        <div className='flex flex-1 flex-col m-4'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
