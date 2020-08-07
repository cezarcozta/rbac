import { Router } from 'express';

import UserController from './controllers/UserController'
import SessionController from './controllers/SessionController'
import PermissionController from './controllers/PermissionController';
import RoleController from './controllers/RoleController';

import is from './middleware/permission';

const router = Router();

const userController = new UserController();
const sessionController = new SessionController();
const permissionController = new PermissionController();
const roleController = new RoleController();

router.post('/sessions', sessionController.create);

router.post('/users', userController.create);
router.get('/users', is(['ROLE_ADMIN3']), userController.index);
router.get('/users/:id', userController.show);

router.post('/permissions', is(['ROLE_ADMIN3']), permissionController.create);
router.get('/permissions', is(['ROLE_ADMIN3']), permissionController.index);

router.post('/roles', is(['ROLE_ADMIN3']), roleController.create);
router.get('/roles', is(['ROLE_ADMIN3']), roleController.index);

export default router;