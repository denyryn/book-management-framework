import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    headerChildren?: ReactNode;
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, headerChildren, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate headerChildren={headerChildren} breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayoutTemplate>
);
