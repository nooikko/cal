import { SettingsSidebar } from '@/components/custom/settings-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SettingsSidebar />
      <main className='flex flex-1'>
        <SidebarTrigger className='block md:hidden' />
        <div className='flex flex-1 flex-col m-4'>{children}</div>
      </main>
    </SidebarProvider>
  );
}
