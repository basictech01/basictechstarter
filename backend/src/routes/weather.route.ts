import { type NextFunction, type Request, type Response, Router } from 'express';
import { z } from 'zod';

import { CACHE_TTL_WEATHER } from '../config/constants.js';
import * as weatherController from '../controllers/weather.controller.js';
import { cacheMiddleware } from '../middleware/cache.middleware.js';
import { validateRequest } from '../middleware/validate-request.middleware.js';
import { successResponse } from '../utils/response.js';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SCHEMA = {
  SLUG_PARAM: z.object({
    slug: z.string().min(1).max(128).regex(SLUG, 'slug must be a valid slug'),
  }),
} as const;

const weatherRouter = Router();

weatherRouter.get(
  '/stations',
  cacheMiddleware(CACHE_TTL_WEATHER),
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await weatherController.listStations();
    result.match(
      (data) => {
        res.json(successResponse(data, 'Weather stations fetched successfully'));
      },
      (error) => {
        next(error);
      },
    );
  },
);

weatherRouter.get(
  '/summary',
  cacheMiddleware(CACHE_TTL_WEATHER),
  async (_req: Request, res: Response, next: NextFunction) => {
    const result = await weatherController.getSummary();
    result.match(
      (data) => {
        res.json(successResponse(data, 'Weather summary fetched successfully'));
      },
      (error) => {
        next(error);
      },
    );
  },
);

export default weatherRouter;

// --- /api/areas/:slug/weather — mounted separately under `/areas`, same reasoning as
// alerts.route.ts's areaAlertsRouter: the geography module's own route file stays untouched.

const areaWeatherRouter = Router();

areaWeatherRouter.get(
  '/:slug/weather',
  cacheMiddleware(CACHE_TTL_WEATHER),
  validateRequest({ params: SCHEMA.SLUG_PARAM }),
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.validated.params as z.infer<typeof SCHEMA.SLUG_PARAM>;
    const result = await weatherController.getAreaWeather(slug);
    result.match(
      (data) => {
        res.json(successResponse(data, 'District weather fetched successfully'));
      },
      (error) => {
        next(error);
      },
    );
  },
);

export { areaWeatherRouter };
