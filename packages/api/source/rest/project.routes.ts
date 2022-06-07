import type { Request, Response, Router } from "express";
import { projects } from "../controllers";

const attachRoutes = async (router: Router): Promise<void> => {
  router.post("/projects", async (request: Request, response: Response) => {
    response.json(await projects.create(request, request.body));
  });

  router.get(
    "/projects/:name",
    async (request: Request, response: Response) => {
      response.json(await projects.getByName(request, request.params.name));
    }
  );

  router.post(
    "/projects/:name/variants/:variant",
    async (request: Request, response: Response) => {
      response.json(
        await projects.updateVariant(request, {
          name: request.params.name,
          variant: request.params.variant,
          values: request.body,
        })
      );
    }
  );
};

export { attachRoutes };
