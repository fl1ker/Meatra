import { Router } from 'express';
import { login } from './controller';
import {validateRequest} from "../../middlewares/validateRequest";
import {loginValidator} from "./validator";

const router = Router();

router.post('/login', login, validateRequest, loginValidator);

export default router;