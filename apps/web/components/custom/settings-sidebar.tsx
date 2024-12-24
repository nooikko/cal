'use client';

import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { NavbarLinks } from '@/types/navigation';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Logo } from './logo';

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
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuButton tooltip='General' className='h-[unset]' asChild>
            <Link href={NavbarLinks.SETTINGS}>
              <span className='text-lg h-[unset]'>General</span>
            </Link>
          </SidebarMenuButton>
          <Collapsible asChild defaultOpen className='group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip='Personalities' className='h-[unset]'>
                  <span className='text-lg h-[unset]'>Personalities</span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className='mr-0 pr-0'>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href={NavbarLinks.PERSONALITIES_NEW} className='h-[unset] p-1.5 text-base'>
                        <span className='text-base h-[unset] flex items-center'>
                          <Plus className='mr-2 h-4 w-4' /> Add New
                        </span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarFooter>{/* Can add footer content if needed */}</SidebarFooter>
    </Sidebar>
  );
};
