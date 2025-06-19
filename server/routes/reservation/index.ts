import { Router } from 'express';
import { getReservations, createReservation } from './controller';
import { createReservationValidator } from "./validator";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get('/', getReservations);
router.post('/', createReservationValidator, validateRequest, createReservation);


export default router;
