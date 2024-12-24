'use client';

import { SidebarUser } from '@/components/custom/sidebar-user';
import { Sidebar, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { NavbarLinks } from '@/types/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '../ui/button';
import { Logo } from './logo';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <div className='flex flex-col flex-1'>
        <Link
          href={NavbarLinks.HOME}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-left justify-start mx-2 py-3 h-[unset] text-lg',
            isActive(NavbarLinks.HOME) && 'bg-accent text-accent-foreground',
          )}
        >
          Home
        </Link>
        <Link
          href={NavbarLinks.LEARNINGS}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-left justify-start mx-2 py-3 h-[unset] text-lg',
            isActive(NavbarLinks.LEARNINGS) && 'bg-accent text-accent-foreground',
          )}
        >
          Learnings
        </Link>
        <Link
          href={NavbarLinks.RECORDINGS}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-left justify-start mx-2 py-3 h-[unset] text-lg',
            isActive(NavbarLinks.RECORDINGS) && 'bg-accent text-accent-foreground',
          )}
        >
          Recordings
        </Link>
        <Link
          href={NavbarLinks.HEALTH_MONITORING}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-left justify-start mx-2 py-3 h-[unset] text-lg',
            isActive(NavbarLinks.HEALTH_MONITORING) && 'bg-accent text-accent-foreground',
          )}
        >
          Health Monitoring
        </Link>
        <Link
          href={NavbarLinks.SETTINGS}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-left justify-start mx-2 py-3 h-[unset] text-lg',
            isActive(NavbarLinks.SETTINGS) && 'bg-accent text-accent-foreground',
          )}
        >
          Settings
        </Link>
      </div>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
