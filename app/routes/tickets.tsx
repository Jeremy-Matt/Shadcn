import React, { useEffect, useState } from "react";
import { getTicket, fetchAllCustomerSoftwareOverview } from "../lib/api";

interface SoftwareItem {
    CustomerName: string;
    CustomerI3D: number;
    DeviceClass: string;
    Software: string;
    Version: string;
}

export default function TicketsPage() {
    const [ticket, setTicket] = useState<string | null>(null);
    const [items, setItems]   = useState<SoftwareItem[]>([]);
    const [soft, setSoft]     = useState("");
    const [ver, setVer]       = useState("");
    const [search, setSearch] = useState("");

    // 1) Ticket holen
    useEffect(() => {
        getTicket().then(setTicket).catch(console.error);
    }, []);

    // 2) Daten laden
    useEffect(() => {
        if (!ticket) return;
        fetchAllCustomerSoftwareOverview(ticket)
            .then(setItems)
            .catch(console.error);
    }, [ticket]);

    // Dropdown‑Werte
    const softwares = Array.from(new Set(items.map(i => i.Software)));
    const versions  =
        soft === ""
            ? []
            : Array.from(new Set(items.filter(i => i.Software === soft).map(i => i.Version)));

    // Filter anwenden
    const filtered = items
        .filter(i => !soft || i.Software === soft)
        .filter(i => !ver  || i.Version  === ver)
        .filter(i =>
            !search ||
            i.CustomerName.toLowerCase().includes(search.toLowerCase()) ||
            i.CustomerI3D.toString().includes(search)
        );

    return (
        <div className="space-y-6">
            {/* Filter‑Bar */}
            <div className="flex flex-wrap gap-4">
                <select
                    className="border rounded px-3 py-2"
                    value={soft}
                    onChange={e => setSoft(e.target.value)}
                >
                    <option value="">Alle Software</option>
                    {softwares.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="border rounded px-3 py-2"
                    value={ver}
                    onChange={e => setVer(e.target.value)}
                    disabled={!soft}
                >
                    <option value="">Alle Versionen</option>
                    {versions.map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Suche…"
                    className="border rounded px-3 py-2 flex-1 min-w-[200px]"
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Tabelle */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        {["Kundenname","Kundennummer","Software","Version"].map(h => (
                            <th key={h} className="p-2 text-left">{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="p-2">{r.CustomerName}</td>
                            <td className="p-2">{r.CustomerI3D}</td>
                            <td className="p-2">{r.Software}</td>
                            <td className="p-2">{r.Version}</td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500">
                                Keine Einträge gefunden.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
