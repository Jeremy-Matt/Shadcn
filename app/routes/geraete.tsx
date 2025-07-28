import React from "react";
import { useNavigate } from "react-router-dom";

interface Device {
    DeviceI3D: number;
    CustomerI3D: number;
    CustomerName: string;
    Software: string;
    SoftwareVersion: string;
    DeviceName: string;
    LastUser: string | null;
    LastUpdate: string | null;
}

function formatDate(date: string | null | undefined): string {
    if (!date) return "";
    const match = /\/Date\((\d+)(?:[+-]\d+)?\)\//.exec(date);
    return match ? new Date(Number(match[1])).toLocaleDateString() : date;
}

async function getTicket(): Promise<string> {
    const res = await fetch(
        "https://hilfe.matt-edv.de/centronservicede/REST/Login",
        {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Ticket: "Text",
                TrimResponse: 0,
                Data: {
                    AppVersion: "2.0.2409.884",
                    Application: "5b6fd73e-a6f3-4b90-89f7-b99658976743",
                    Device: "Testclient",
                    LoginKind: 1,
                    Password: "Siddharthine;1",
                    Username: "Jeremy",
                },
            }),
        },
    );
    const data = await res.json();
    if (Array.isArray(data.Result) && data.Result.length > 0) {
        return data.Result[0] as string;
    }
    throw new Error("No ticket received");
}

export default function Geraete() {
    const [devices, setDevices] = React.useState<Device[]>([]);
    // start with an empty search input so users can search any software
    const [query, setQuery] = React.useState<string>("");
    const [versionFilter, setVersionFilter] = React.useState<string>("");
    const [deviceFilter, setDeviceFilter] = React.useState<string>("");
    const [page, setPage] = React.useState(1);
    const navigate = useNavigate();

    const searchDevices = React.useCallback(
        async (software: string) => {
            try {
                const ticket = await getTicket();
                const res = await fetch(
                    "https://monitoring01.matt-edv.com/docuboardde/REST/GetAllCustomerSoftwareOverview",
                    {
                        method: "POST",
                        headers: {
                            accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Ticket: ticket,
                            Data: { Software: software },
                        }),
                    },
                );

                const data = await res.json();
                if (data && Array.isArray(data.Result)) {
                    setDevices(data.Result as Device[]);
                } else {
                    setDevices([]);
                }
                setPage(1);
            } catch (err) {
                console.error("Failed to fetch devices", err);
            }
        },
        [],
    );

    const versionOptions = React.useMemo(
        () => Array.from(new Set(devices.map((d) => d.SoftwareVersion).filter(Boolean))),
        [devices],
    );
    const deviceOptions = React.useMemo(
        () => Array.from(new Set(devices.map((d) => d.DeviceName).filter(Boolean))),
        [devices],
    );

    const filteredDevices = React.useMemo(() => {
        const q = query.toLowerCase();
        return devices.filter((d) => {
            if (versionFilter && d.SoftwareVersion !== versionFilter) return false;
            if (deviceFilter && d.DeviceName !== deviceFilter) return false;
            return (
                d.CustomerName.toLowerCase().includes(q) ||
                d.Software.toLowerCase().includes(q) ||
                d.SoftwareVersion.toLowerCase().includes(q) ||
                d.DeviceName.toLowerCase().includes(q) ||
                (d.LastUser ?? "").toLowerCase().includes(q) ||
                String(d.CustomerI3D).includes(q) ||
                formatDate(d.LastUpdate).toLowerCase().includes(q)
            );
        });
    }, [devices, query, versionFilter, deviceFilter]);

    React.useEffect(() => {
        setPage(1);
    }, [query, versionFilter, deviceFilter]);

    const pageSize = 100;
    const pageCount = Math.ceil(filteredDevices.length / pageSize);
    const pagedDevices = React.useMemo(
        () =>
            filteredDevices.slice(
                (page - 1) * pageSize,
                (page - 1) * pageSize + pageSize,
            ),
        [filteredDevices, page],
    );

    React.useEffect(() => {
        // load an initial list of devices for a common software
        searchDevices("Sophos Endpoint Firewall");
        // initial fetch on mount only
    }, []);

    return (
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Geräte</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setPage(1);
                        searchDevices(query);
                    }}
                    className="mb-2 flex gap-2"
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Suchen..."
                        className="border rounded px-2 py-1 w-64"
                    />
                    <select
                        value={versionFilter}
                        onChange={(e) => setVersionFilter(e.target.value)}
                        className="hover:bg-gray-100 cursor-pointer border rounded px-2 py-1"
                    >
                        <option value="">Alle Versionen</option>
                        {versionOptions.map((v) => (
                            <option key={v} value={v}>
                                {v}
                            </option>
                        ))}
                    </select>
                    <select
                        value={deviceFilter}
                        onChange={(e) => setDeviceFilter(e.target.value)}
                        className="hover:bg-gray-100 cursor-pointer border rounded px-2 py-1"
                    >
                        <option value="">Alle Geräte</option>
                        {deviceOptions.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </form>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Kundennummer</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Kundenname</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Software</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Version</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Hostname</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Benutzer</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Letztes Update</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {pagedDevices.map((d) => (
                        <tr
                            key={d.DeviceI3D}
                            className="hover:bg-gray-200 cursor-pointer"
                            onDoubleClick={() =>
                                navigate(`/geraete/bearbeiten/${d.DeviceI3D}`, {
                                    state: d,
                                })
                            }
                        >
                            <td className="px-3 py-2">{d.CustomerI3D}</td>
                            <td className="px-3 py-2">{d.CustomerName}</td>
                            <td className="px-3 py-2">{d.Software}</td>
                            <td className="px-3 py-2">{d.SoftwareVersion}</td>
                            <td className="px-3 py-2">{d.DeviceName}</td>
                            <td className="px-3 py-2">{d.LastUser ?? "-"}</td>
                            <td className="px-3 py-2">{formatDate(d.LastUpdate)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {pageCount > 1 && (
                    <div className="mt-4 flex gap-2">
                        <button
                            className="hover:bg-gray-200 cursor-pointer px-3 py-1 border rounded"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Zurück
                        </button>
                        <span className="px-2 self-center">
                        Seite {page} / {pageCount}
                    </span>
                        <button
                            className="hover:bg-gray-200 cursor-pointer px-3 py-1 border rounded"
                            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                            disabled={page === pageCount}
                        >
                            Weiter
                        </button>
                    </div>
                )}
            </div>
            );
            }