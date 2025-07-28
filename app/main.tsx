import React from "react";
import { createRoot } from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Root     from "./root";
import Home     from "./routes/index";
import Tickets  from "./routes/tickets";
import Geraete  from "./routes/geraete";
import EditDevice from "./routes/geraete-bearbeiten";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route element={<Root />}>
                <Route index element={<Home />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="geraete" element={<Geraete />} />
                <Route path="geraete/bearbeiten/:id" element={<EditDevice />} />
            </Route>
        </Routes>
    </BrowserRouter>
);