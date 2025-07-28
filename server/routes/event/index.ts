import { Router } from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from './controller';
import {createEventValidator, deleteEventValidator, updateEventValidator} from './validator';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { upload } from '../../middlewares/upload';

const router = Router();

router.get('/', getEvents);
router.post('/', checkAuth, upload.single('image'), createEventValidator, validateRequest, createEvent);
router.put('/:id', checkAuth, upload.single('image'), updateEventValidator, validateRequest, updateEvent);
router.delete('/:id', checkAuth, deleteEventValidator, validateRequest, deleteEvent);

export default router;
