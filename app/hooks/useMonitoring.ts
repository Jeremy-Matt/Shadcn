// my-app/app/hooks/useMonitoring.ts
import { useQuery } from "@tanstack/react-query";
import { callMonitoring } from "../lib/api";

export interface SoftwareOverviewItem {
    CustomerName:     string;
    CustomerI3D:      number;
    DeviceClass:      string;
    Software:         string;
    SoftwareVersion:  string;
    Version:          string;
    Anzahl:           number; // ggf. aus Länge der Einträge berechnen
    Server:           number; // ggf. berechnet
    Clients:          number; // ggf. berechnet
}

export function useSoftwareOverview(ticket: string) {
    return useQuery<SoftwareOverviewItem[]>(
        ["softwareOverview"],
        () => callMonitoring<SoftwareOverviewItem[]>(
            "GetAllCustomerSoftwareOverview",
            { DeviceClass: 0, Software: "" },
            ticket
        )
    );
}

export function useDeviceClasses(ticket: string) {
    return useQuery<string[]>(
        ["deviceClasses"],
        () => callMonitoring<string[]>("GetActiveDeviceClass", {}, ticket)
    );
}

export interface DeviceItem {
    I3D:        number;
    ShortName:  string;
    DeviceClass:string;
    DNSHostName:string;
    // … weitere Felder, die du brauchst
}

export function useDevicesByClass(ticket: string, cls: string) {
    return useQuery<DeviceItem[]>(
        ["devices", cls],
        () => callMonitoring<DeviceItem[]>("GetAllDevicesByShortName", cls, ticket),
        { enabled: !!cls }
    );
}
