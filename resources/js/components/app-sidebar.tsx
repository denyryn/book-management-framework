import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SidenavContext } from '@/contexts/SidenavContext';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Book, Building, Home, LayoutGrid, PersonStanding } from 'lucide-react';
import React from 'react';
import AppLogo from './app-logo';

const authenticatedNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const unauthenticatedNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/home',
        icon: Home,
    },
    {
        title: 'Books',
        href: '/books',
        icon: Book,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: LayoutGrid,
    },
    {
        title: 'Authors',
        href: '/authors',
        icon: PersonStanding,
    },
    {
        title: 'Publishers',
        href: '/publishers',
        icon: Building,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { items, setItems } = React.useContext(SidenavContext);

    React.useEffect(() => {
        setItems(auth.user ? authenticatedNavItems : unauthenticatedNavItems);
    }, [auth.user, setItems]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                {/* <NavUser /> */}
            </SidebarFooter>
        </Sidebar>
    );
}
