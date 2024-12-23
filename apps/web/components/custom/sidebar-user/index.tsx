'use client';

import { ChevronsUpDown, LogOut, User } from 'lucide-react';

import { Spinner } from '@/components/custom/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { logout } from './actions/logout';

export function SidebarUser() {
  const { data: session, status } = useSession();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <Spinner className='h-8 w-8 rounded-lg' />
              ) : (
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
              )}
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{status === 'loading' ? <Skeleton className='h-3 mb-1 w-16' /> : session?.user?.name}</span>
                <span className='truncate text-xs'>{status === 'loading' ? <Skeleton className='h-3 w-24' /> : session?.user?.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                {status === 'loading' ? (
                  <Spinner className='h-8 w-8 rounded-lg' />
                ) : (
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>
                )}
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{status === 'loading' ? <Skeleton className='h-4 w-16' /> : session?.user?.name}</span>
                  <span className='truncate text-xs'>{status === 'loading' ? <Skeleton className='h-3 w-24' /> : session?.user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href='/profile'>
              <DropdownMenuItem className='cursor-pointer'>
                <User />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className='cursor-pointer'>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
