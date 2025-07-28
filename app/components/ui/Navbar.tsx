// app/components/ui/Navbar.tsx
import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
    { to: "/",       label: "Home" },
    { to: "/geraete", label: "Geräte" },
    { to: "/tickets", label: "Tickets" },
];

export default function Navbar() {
    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto flex justify-center space-x-4">
                {tabs.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                            "px-4 py-2 rounded-full font-medium transition " +
                            (isActive
                                ? "bg-black text-white"
                                : "text-gray-600 hover:bg-gray-200")
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
