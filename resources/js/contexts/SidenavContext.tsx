import { type NavItem } from '@/types';
import React, { createContext, useState } from 'react';

const initialItems: NavItem[] = [];

export const SidenavContext = createContext<{
    items: NavItem[];
    setItems: React.Dispatch<React.SetStateAction<NavItem[]>>;
}>({
    items: initialItems,
    setItems: () => {},
});

export const SidenavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState(initialItems);

    return <SidenavContext.Provider value={{ items, setItems }}>{children}</SidenavContext.Provider>;
};
