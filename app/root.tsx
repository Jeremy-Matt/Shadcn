import { Outlet } from "react-router-dom";
import Navbar       from "./components/ui/Navbar";
import "./app.css";

export default function Root() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1 container mx-auto px-6 py-10">
                <Outlet />
            </main>
        </div>
    );
}