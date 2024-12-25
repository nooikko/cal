'use client';
import { Sidebar, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { NavbarLinks } from '@/types/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { Logo } from './logo';
import { SidebarUser } from './sidebar-user';

export const SettingsSidebar: React.FC = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <div className='flex items-center text-3xl font-bold px-2 space-x-4 mt-1'>
        <Link
          href={NavbarLinks.HOME}
          className={cn(buttonVariants({ variant: 'ghost' }), 'text-lg text-left justify-start w-full px-2 hover:bg-sidebar-accent')}
        >
          <ArrowLeft className='h-6 w-6' />
          Back to App
        </Link>
      </div>
      <div className='flex flex-col flex-1'>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton tooltip='General' className='h-[unset]' asChild>
              <Link href={NavbarLinks.SETTINGS}>
                <span className='text-lg h-[unset]'>General</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton tooltip='Personalities' className='h-[unset]' asChild>
              <Link href={NavbarLinks.PERSONALITIES}>
                <span className='text-lg h-[unset]'>Personalities</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>
      </div>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};
