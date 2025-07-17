import { NavLink } from "react-router-dom";
import { buttonVariants } from "./button";

export default function Navbar() {
    const links: { to: string; label: string }[] = [
        { to: "/",       label: "Home" },
        { to: "/geraete",label: "Geräte"      },
        { to: "/tickets",label: "Tickets"     },
    ];

    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto flex justify-center space-x-6 px-6 py-4">
                {links.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            buttonVariants({
                                variant: isActive ? "default" : "outline",
                                size: "sm",
                            }) + " rounded-full"
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
