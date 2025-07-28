import React from "react";
import { useLocation, useParams } from "react-router-dom";

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

export default function EditDevice() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const device = location.state as Device | undefined;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Gerät bearbeiten</h1>
            {device ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kundennummer</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kundenname</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Software</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Version</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Hostname</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Benutzer</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Letztes Update</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="px-3 py-2">{device.CustomerI3D}</td>
                        <td className="px-3 py-2">{device.CustomerName}</td>
                        <td className="px-3 py-2">{device.Software}</td>
                        <td className="px-3 py-2">{device.SoftwareVersion}</td>
                        <td className="px-3 py-2">{device.DeviceName}</td>
                        <td className="px-3 py-2">{device.LastUser ?? "-"}</td>
                        <td className="px-3 py-2">{formatDate(device.LastUpdate)}</td>
                    </tr>
                    </tbody>
                </table>
            ) : (
                <p>ID: {id}</p>
            )}
        </div>
    );
}