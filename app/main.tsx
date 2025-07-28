import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Root from "./root";
import Home from "./routes/index";
import GeraetePage from "./routes/geraete";
import GeraeteBearbeitenPage from "./routes/geraete-bearbeiten";
import TicketsPage from "./routes/tickets";
import "./app.css";

const container = document.getElementById("root")!;
createRoot(container).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Root />}>
                <Route index element={<Home />} />
                <Route path="geraete" element={<GeraetePage />} />
                <Route path="geraete/bearbeiten/:id" element={<GeraeteBearbeitenPage />} />
                <Route path="tickets" element={<TicketsPage />} />
            </Route>
        </Routes>
    </BrowserRouter>
);