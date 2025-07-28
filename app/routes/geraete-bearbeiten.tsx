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

export default function GeraeteBearbeiten() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const device = location.state as Device | undefined;

    if (!device) {
        return (
            <div className="space-y-2">
                <h1 className="text-xl font-bold">Gerät {id}</h1>
                <p className="text-red-500">Keine Gerätedaten vorhanden.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <h1 className="text-xl font-bold">Gerät bearbeiten</h1>
            <p>Kundennummer: {device.CustomerI3D}</p>
            <p>Kundenname: {device.CustomerName}</p>
            <p>Software: {device.Software}</p>
            <p>Version: {device.SoftwareVersion}</p>
            <p>Hostname: {device.DeviceName}</p>
            <p>Benutzer: {device.LastUser ?? "-"}</p>
            <p>Letztes Update: {formatDate(device.LastUpdate)}</p>
        </div>
    );
}
