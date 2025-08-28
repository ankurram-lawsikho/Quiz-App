import { In } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { Permission } from '../../../entities/Permission';
import { Role } from '../../../entities/Role';
import { User } from '../../../entities/User';
import { IPermission } from '../../../types/auth.types';

const permissionRepository = AppDataSource.getRepository(Permission);
const roleRepository = AppDataSource.getRepository(Role);
const userRepository = AppDataSource.getRepository(User);

export const createPermission = async (permissionData: Partial<IPermission>): Promise<IPermission> => {
    const permission = permissionRepository.create(permissionData);
    return await permissionRepository.save(permission);
};

export const getAllPermissions = async (): Promise<IPermission[]> => {
    return await permissionRepository.find({
        relations: ['roles']
    });
};

export const getPermissionById = async (id: number): Promise<IPermission | null> => {
    return await permissionRepository.findOne({
        where: { id },
        relations: ['roles']
    });
};

export const updatePermission = async (id: number, permissionData: Partial<IPermission>): Promise<IPermission | null> => {
    await permissionRepository.update(id, permissionData);
    return await getPermissionById(id);
};

export const deletePermission = async (id: number): Promise<boolean> => {
    const result = await permissionRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
};

export const createRole = async (roleData: { name: string; description?: string; permissionIds?: number[] }): Promise<Role> => {
    const role = roleRepository.create({
        name: roleData.name,
        description: roleData.description,
        permissions: []
    });

    if (roleData.permissionIds && roleData.permissionIds.length > 0) {
        const permissions = await permissionRepository.findBy({ id: In(roleData.permissionIds) });
        role.permissions = permissions;
    }

    return await roleRepository.save(role);
};

export const getAllRoles = async (): Promise<Role[]> => {
    return await roleRepository.find({
        relations: ['permissions', 'users']
    });
};

export const getRoleById = async (id: number): Promise<Role | null> => {
    return await roleRepository.findOne({
        where: { id },
        relations: ['permissions', 'users']
    });
};

export const updateRole = async (id: number, roleData: { name?: string; description?: string; permissionIds?: number[] }): Promise<Role | null> => {
    const role = await getRoleById(id);
    if (!role) return null;

    if (roleData.name) role.name = roleData.name;
    if (roleData.description) role.description = roleData.description;

    if (roleData.permissionIds) {
        const permissions = await permissionRepository.findBy({ id: In(roleData.permissionIds) });
        role.permissions = permissions;
    }

    return await roleRepository.save(role);
};

export const deleteRole = async (id: number): Promise<boolean> => {
    const result = await roleRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
};

export const assignRoleToUser = async (userId: number, roleId: number): Promise<boolean> => {
    const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
    });

    const role = await getRoleById(roleId);
    if (!user || !role) return false;

    if (!user.roles) user.roles = [];
    user.roles.push(role);

    await userRepository.save(user);
    return true;
};

export const removeRoleFromUser = async (userId: number, roleId: number): Promise<boolean> => {
    const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['roles']
    });

    if (!user || !user.roles) return false;

    user.roles = user.roles.filter(role => role.id !== roleId);
    await userRepository.save(user);
    return true;
};
