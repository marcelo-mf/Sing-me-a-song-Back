import { recommendationService } from "../services/recommendationsService.js";
import {Request, Response} from "express";

async function truncate(req: Request, res: Response) {
    await recommendationService.truncate();
  
    res.sendStatus(200);
}

export default {
    truncate,
}