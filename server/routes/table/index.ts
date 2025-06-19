import { Router } from 'express';
import { getTables, createTable } from './controller';
import { createTableValidator } from "./validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from '../../middlewares/checkAuth';


const router = Router();

router.get('/', getTables);
router.post('/', checkAuth, createTableValidator, validateRequest, createTable);

export default router;
