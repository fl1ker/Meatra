import { Router } from 'express';
import { getTables, createTable, deleteTable, updateTable } from './controller';
import { createTableValidator, updateTableValidator, deleteTableValidator, getTablesValidator } from "./validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from '../../middlewares/checkAuth';


const router = Router();

router.get('/', getTablesValidator, validateRequest, getTables);
router.post('/', checkAuth, createTableValidator, validateRequest, createTable);
router.put('/:id', checkAuth, updateTableValidator, validateRequest, updateTable);
router.delete('/:id', checkAuth, deleteTableValidator, validateRequest, deleteTable);

export default router;
