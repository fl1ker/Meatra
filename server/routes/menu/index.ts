import { Router } from 'express';
import {
    createMenu,
    getMenus,
    updateMenu,
    deleteMenu,
    createMenuCategory,
    getMenuCategories,
    updateMenuCategory,
    deleteMenuCategory,
    assignCategoryToMenu,
    createMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
} from './controller';
import {
    createMenuValidator,
    updateMenuValidator,
    deleteMenuValidator,
    createMenuCategoryValidator,
    updateMenuCategoryValidator,
    deleteMenuCategoryValidator,
    assignCategoryToMenuValidator,
    createMenuItemValidator,
    updateMenuItemValidator,
    deleteMenuItemValidator,
} from './validator';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';



const router = Router();

// Маршруты для меню
router.post('/', checkAuth, createMenuValidator, validateRequest, createMenu);
router.get('/', checkAuth, getMenus);
router.put('/:id', checkAuth, updateMenuValidator, validateRequest, updateMenu);
router.delete('/:id', checkAuth, deleteMenuValidator, validateRequest, deleteMenu);

// Маршруты для категорий
router.post('/categories', checkAuth, createMenuCategoryValidator, validateRequest, createMenuCategory);
router.get('/categories', checkAuth, getMenuCategories);
router.put('/categories/:id', checkAuth, updateMenuCategoryValidator, validateRequest, updateMenuCategory);
router.delete('/categories/:id', checkAuth, deleteMenuCategoryValidator, validateRequest, deleteMenuCategory);
router.post('/categories/assign', checkAuth, assignCategoryToMenuValidator, validateRequest, assignCategoryToMenu);

// Маршруты для блюд
router.post('/items', checkAuth, createMenuItemValidator, validateRequest, createMenuItem);
router.get('/items', checkAuth, getMenuItems);
router.put('/items/:id', checkAuth, updateMenuItemValidator, validateRequest, updateMenuItem);
router.delete('/items/:id', checkAuth, deleteMenuItemValidator, validateRequest, deleteMenuItem);

export default router;