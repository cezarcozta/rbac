import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';

import UserController from './controllers/UserController'
import SessionController from './controllers/SessionController'
import PermissionController from './controllers/PermissionController';
import RoleController from './controllers/RoleController';

import is from './middleware/permission';

const router = Router();

const upload = multer(uploadConfig);

const userController = new UserController();
const sessionController = new SessionController();
const permissionController = new PermissionController();
const roleController = new RoleController();

router.post('/sessions', sessionController.create);

router.post('/users', upload.single('image'), userController.create);
router.get('/users', is(['ROLE_ADMIN']), userController.index);
router.get('/users/:id', userController.show);
router.put('/users/:id', is(['ROLE_ADMIN', 'ROLE_ORDINARY'])); //Falta controller
router.patch('/users/:id',is(['ROLE_ADMIN'])); //falta controller

router.post('/permissions', is(['ROLE_ADMIN']), permissionController.create);
router.get('/permissions', is(['ROLE_ADMIN']), permissionController.index);

router.post('/roles', is(['ROLE_ADMIN']), roleController.create);
router.get('/roles', is(['ROLE_ADMIN']), roleController.index);

export default router;