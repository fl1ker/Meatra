import { body, param } from 'express-validator';

// Валидаторы для меню
export const createMenuValidator = [
    body('name')
        .isString()
        .notEmpty()
        .withMessage('Menu name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Menu name must be between 2 and 50 characters'),
];

export const updateMenuValidator = [
    param('id')
        .isNumeric()
        .withMessage('Menu ID must be a number'),
    body('name')
        .isString()
        .notEmpty()
        .withMessage('Menu name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Menu name must be between 2 and 50 characters'),
];

export const deleteMenuValidator = [
    param('id')
        .isNumeric()
        .withMessage('Menu ID must be a number'),
];

// Валидаторы для категорий
export const createMenuCategoryValidator = [
    body('name')
        .isString()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Category name must be between 2 and 50 characters'),
];

export const updateMenuCategoryValidator = [
    param('id')
        .isNumeric()
        .withMessage('Category ID must be a number'),
    body('name')
        .isString()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Category name must be between 2 and 50 characters'),
];

export const deleteMenuCategoryValidator = [
    param('id')
        .isNumeric()
        .withMessage('Category ID must be a number'),
];

export const assignCategoryToMenuValidator = [
    body('menuId')
        .isNumeric()
        .withMessage('Menu ID must be a number'),
    body('categoryId')
        .isNumeric()
        .withMessage('Category ID must be a number'),
];

// Валидаторы для блюд
export const createMenuItemValidator = [
    body('name')
        .isString()
        .notEmpty()
        .withMessage('Menu item name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Menu item name must be between 2 and 100 characters'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('categoryId')
        .isNumeric()
        .withMessage('Category ID must be a number'),
];

export const updateMenuItemValidator = [
    param('id')
        .isNumeric()
        .withMessage('Menu item ID must be a number'),
    body('name')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Menu item name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Menu item name five between 2 and 100 characters'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('categoryId')
        .optional()
        .isNumeric()
        .withMessage('Category ID must be a number'),
];

export const deleteMenuItemValidator = [
    param('id')
        .isNumeric()
        .withMessage('Menu item ID must be a number'),
];