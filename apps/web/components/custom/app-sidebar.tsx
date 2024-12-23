'use client';

import { SidebarUser } from '@/components/custom/sidebar-user';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Code } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import Link from 'next/link';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className='flex items-center text-3xl font-bold px-2 space-x-4'>
          <Code />
          <h1>CAL</h1>
        </div>
      </SidebarHeader>
      <div className='flex flex-col flex-1'>
        <Link href='/' className={cn(buttonVariants({ variant: 'ghost' }), ' text-left justify-start mx-2 py-3 h-[unset] text-lg ')}>
          Home
        </Link>
        <Link href='/learnings' className={cn(buttonVariants({ variant: 'ghost' }), ' text-left justify-start mx-2 py-3 h-[unset] text-lg')}>
          Learnings
        </Link>
        <Link href='/recordings' className={cn(buttonVariants({ variant: 'ghost' }), ' text-left justify-start mx-2 py-3 h-[unset] text-lg')}>
          Recordings
        </Link>
        <Link href='/health-monitoring' className={cn(buttonVariants({ variant: 'ghost' }), ' text-left justify-start mx-2 py-3 h-[unset] text-lg')}>
          Health Monitoring
        </Link>
        <Link href='/settings' className={cn(buttonVariants({ variant: 'ghost' }), ' text-left justify-start mx-2 py-3 h-[unset] text-lg')}>
          Settings
        </Link>
      </div>
      <SidebarFooter>
        <SidebarUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
