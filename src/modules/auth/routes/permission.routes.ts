import { Router } from 'express';
import { 
    createPermission, 
    getAllPermissions, 
    getPermissionById, 
    updatePermission, 
    deletePermission,
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    assignRoleToUser,
    removeRoleFromUser
} from '../controllers/permission.controller';
import { authenticateToken, requirePermission } from '../../../middleware/auth.middleware';

const router = Router();

// Permission routes
router.post('/permissions', authenticateToken, requirePermission('permission', 'create'), createPermission);
router.get('/permissions', authenticateToken, requirePermission('permission', 'read'), getAllPermissions);
router.get('/permissions/:id', authenticateToken, requirePermission('permission', 'read'), getPermissionById);
router.put('/permissions/:id', authenticateToken, requirePermission('permission', 'update'), updatePermission);
router.delete('/permissions/:id', authenticateToken, requirePermission('permission', 'delete'), deletePermission);

// Role routes
router.post('/roles', authenticateToken, requirePermission('role', 'create'), createRole);
router.get('/roles', authenticateToken, requirePermission('role', 'read'), getAllRoles);
router.get('/roles/:id', authenticateToken, requirePermission('role', 'read'), getRoleById);
router.put('/roles/:id', authenticateToken, requirePermission('role', 'update'), updateRole);
router.delete('/roles/:id', authenticateToken, requirePermission('role', 'delete'), deleteRole);

// User role management
router.post('/users/:userId/roles/:roleId', authenticateToken, requirePermission('user', 'manage'), assignRoleToUser);
router.delete('/users/:userId/roles/:roleId', authenticateToken, requirePermission('user', 'manage'), removeRoleFromUser);

export default router;
