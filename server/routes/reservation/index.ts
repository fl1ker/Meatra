import { Router } from 'express';
import { getReservations, createReservation, updateReservation, deleteReservation } from './controller';
import { createReservationValidator, updateReservationValidator, deleteReservationValidator } from "./validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from '../../middlewares/checkAuth';

const router = Router();

router.get('/', checkAuth, getReservations);
router.post('/', createReservationValidator, validateRequest, createReservation);
router.put('/:id', checkAuth, updateReservationValidator, validateRequest, updateReservation);
router.delete('/:id', checkAuth, deleteReservationValidator, validateRequest, deleteReservation);

export default router;
