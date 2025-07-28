import { Router } from 'express';
import {getJobPositions, createJobApplication, getJobApplications, createJobPosition} from './controller';
import {createJobApplicationValidator, createJobPositionValidator} from './validator';
import { validateRequest } from '../../middlewares/validateRequest';
import {checkAuth} from "../../middlewares/checkAuth";

const router = Router();

router.get('/', getJobPositions);
router.get('/applications', checkAuth, getJobApplications);
router.post('/applications', createJobApplicationValidator, validateRequest, createJobApplication);
router.post('/positions', checkAuth, createJobPositionValidator, validateRequest, createJobPosition);

export default router;