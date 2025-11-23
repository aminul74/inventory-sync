import React from "react";
import { NavMenu } from "@shopify/app-bridge-react";

type NavItem = {
    label: string;
    destination: string;
};

const AppNavMenu = () => {
    const navItems: NavItem[] = [
        { label: "Sync", destination: "/" },
        { label: "Settings", destination: "/settings" },
    ];

    return (
        <NavMenu>
            {navItems.map((item, index) => (
                <a key={index} href={item.destination}>
                    {item.label}
                </a>
            ))}
        </NavMenu>
    );
};

export default AppNavMenu;
