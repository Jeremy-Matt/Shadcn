// app/lib/api.ts
export interface ApiResponse<T> {
    Message: string | null;
    MessageCode: number;
    Status: number;
    Result: T;
}

const CENTRON_BASE    = "https://hilfe.matt-edv.de/centronservicede/REST/";
const MONITORING_BASE = "https://monitoring01.matt-edv.com/docuboardde/REST/";

export async function getTicket(): Promise<string> {
    const res = await fetch(CENTRON_BASE + "Login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            Ticket: "",
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
    });
    if (!res.ok) throw new Error("Login fehlgeschlagen");
    const json = (await res.json()) as ApiResponse<string[]>;
    return json.Result[0];
}

async function postApi<T>(
    base: string,
    path: string,
    ticket: string,
    data: any
): Promise<T> {
    const res = await fetch(base + path, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ Ticket: ticket, TrimResponse: 0, Data: data }),
    });
    if (!res.ok) throw new Error(`Fehler bei ${path}: ${res.statusText}`);
    const json = (await res.json()) as ApiResponse<T>;
    return json.Result;
}

export async function fetchDeviceClasses(ticket: string): Promise<string[]> {
    return postApi<string[]>(MONITORING_BASE, "GetActiveDeviceClass", ticket, {});
}

export async function fetchAllCustomerSoftwareOverview(
    ticket: string
): Promise<{
    CustomerName: string;
    CustomerI3D:  number;
    DeviceClass:  string;
    Software:     string;
    Version:      string;
    // weitere Felder…
}[]> {
    return postApi(
        MONITORING_BASE,
        "GetAllCustomerSoftwareOverview",
        ticket,
        { DeviceClass: 0, Software: "" }
    );
}
export interface Device {
    I3D: number;
    ShortName: string;
    DNSHostName: string;
    LastUpdate: string;
    DeviceClass: string;
    // …ggf. weitere Felder
}

/** Holt ALLE Geräte (ohne ShortName‑Filter) */
export async function fetchAllDevices(
    ticket: string
): Promise<Device[]> {
    // Data: "" liefert alle Geräte
    return postApi<Device[]>(MONITORING_BASE, "GetAllDevicesByShortName", ticket, "");
}
export async function fetchDevicesByClass(
    ticket: string,
    cls: string
): Promise<{
    I3D: number;
    CustomerI3D: number;
    DNSHostName: string;
    UserName: string;
    LastUpdate: string;
}[]> {
    // Leerstring "" liefert in dieser API alle Geräte
    return postApi(
        MONITORING_BASE,
        "GetAllDevicesByShortName",
        ticket,
        cls
    );
}

// Kundendaten per I3D
export async function fetchCustomerByI3D(
    ticket: string,
    customerI3D: number
): Promise<{ FullName: string; I3D: number }> {
    // 1) hole das Array
    const results = await postApi<
        Array<{
            I3D: number;
            FirstName: string;
            LastName: string;
            FullName: string;        // enthält z.B. "Proba, Ralf (RP)"
            DisplayText: string;     // ggf. auch hiermit arbeiten
        }>
    >(CENTRON_BASE, "GetCustomerByI3D", ticket, customerI3D);

    // 2) gib das erste Element zurück (oder wirf Fehler, falls leer)
    if (results.length === 0) {
        throw new Error(`Kein Kunde gefunden für I3D ${customerI3D}`);
    }
    return results[0];
}