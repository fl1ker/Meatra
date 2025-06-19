import { Router } from 'express';
import { getTables, createTable } from './controller';
import { createTableValidator } from "./validator";
import { validateRequest } from "../../middlewares/validateRequest";


const router = Router();

router.get('/', getTables);
router.post('/', createTableValidator, validateRequest, createTable);

export default router;
