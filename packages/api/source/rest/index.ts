import { Router } from "express";

import * as statuses from "./status.routes";
import * as projects from "./project.routes";

export const attachRoutes = async (app: any): Promise<void> => {
    const router = Router();
    app.use("/api/v1", router);

    await statuses.attachRoutes(router);
    await projects.attachRoutes(router);
};
