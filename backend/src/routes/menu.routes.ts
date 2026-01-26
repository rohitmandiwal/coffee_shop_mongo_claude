import { Router } from 'express';
import { menuController } from '../controllers/menu.controller';

const router = Router();

router.post('/', (req, res, next) => menuController.createMenuItem(req, res, next));
router.get('/', (req, res, next) => menuController.getMenuItems(req, res, next));
router.get('/:id', (req, res, next) => menuController.getMenuItemById(req, res, next));
router.patch('/:id', (req, res, next) => menuController.updateMenuItem(req, res, next));
router.delete('/:id', (req, res, next) => menuController.deleteMenuItem(req, res, next));
router.patch('/:id/availability', (req, res, next) => menuController.toggleMenuItemAvailability(req, res, next));

export default router;
