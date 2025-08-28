import { Request, Response } from 'express';
import * as permissionService from '../services/permission.service';

/**
 * @swagger
 * /api/v1/auth/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               resource:
 *                 type: string
 *               action:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Bad request
 */
export const createPermission = async (req: Request, res: Response) => {
    try {
        const permission = await permissionService.createPermission(req.body);
        res.status(201).json(permission);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 */
export const getAllPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await permissionService.getAllPermissions();
        res.json(permissions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission details
 *       404:
 *         description: Permission not found
 */
export const getPermissionById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const permission = await permissionService.getPermissionById(id);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.json(permission);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/permissions/{id}:
 *   put:
 *     summary: Update permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               resource:
 *                 type: string
 *               action:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       404:
 *         description: Permission not found
 */
export const updatePermission = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const permission = await permissionService.updatePermission(id, req.body);
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.json(permission);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/permissions/{id}:
 *   delete:
 *     summary: Delete permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 */
export const deletePermission = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await permissionService.deletePermission(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Role created successfully
 */
export const createRole = async (req: Request, res: Response) => {
    try {
        const role = await permissionService.createRole(req.body);
        res.status(201).json(role);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
export const getAllRoles = async (req: Request, res: Response) => {
    try {
        const roles = await permissionService.getAllRoles();
        res.json(roles);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role details
 *       404:
 *         description: Role not found
 */
export const getRoleById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const role = await permissionService.getRoleById(id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/roles/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 */
export const updateRole = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const role = await permissionService.updateRole(id, req.body);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
export const deleteRole = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await permissionService.deleteRole(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/users/{userId}/roles/{roleId}:
 *   post:
 *     summary: Assign role to user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       404:
 *         description: User or role not found
 */
export const assignRoleToUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const roleId = parseInt(req.params.roleId);
        const assigned = await permissionService.assignRoleToUser(userId, roleId);
        if (!assigned) {
            return res.status(404).json({ message: 'User or role not found' });
        }
        res.json({ message: 'Role assigned successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @swagger
 * /api/v1/auth/users/{userId}/roles/{roleId}:
 *   delete:
 *     summary: Remove role from user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role removed successfully
 *       404:
 *         description: User or role not found
 */
export const removeRoleFromUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const roleId = parseInt(req.params.roleId);
        const removed = await permissionService.removeRoleFromUser(userId, roleId);
        if (!removed) {
            return res.status(404).json({ message: 'User or role not found' });
        }
        res.json({ message: 'Role removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
