// my-app/app/main.tsx
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

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route element={<Root />}>
                <Route index element={<Home />} />
                <Route path="tickets" element={<Tickets />} />
                <Route path="geraete" element={<Geraete />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
