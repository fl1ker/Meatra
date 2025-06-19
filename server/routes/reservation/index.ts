import { Router } from 'express';
import { getReservations, createReservation } from './controller';
import { createReservationValidator } from "./validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from '../../middlewares/checkAuth';

const router = Router();

router.get('/', checkAuth, getReservations);
router.post('/', createReservationValidator, validateRequest, createReservation);


export default router;
