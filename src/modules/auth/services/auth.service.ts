import bcrypt from 'bcryptjs';
import { AppDataSource } from '../../../config/data-source';
import { User } from '../../../entities/User';
import { Role } from '../../../entities/Role';
import { Permission } from '../../../entities/Permission';
import { generateToken } from '../../../config/jwt';
import { ILoginRequest, IRegisterRequest, IAuthResponse, IJwtPayload } from '../../../types/auth.types';

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const permissionRepository = AppDataSource.getRepository(Permission);

export const registerUser = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
    const { username, email, password } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findOne({
        where: [{ username }, { email }]
    });

    if (existingUser) {
        throw new Error('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = userRepository.create({
        username,
        email,
        password: hashedPassword,
        roles: []
    });

    const savedUser = await userRepository.save(user);

    // Generate token
    const token = generateToken({
        userId: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        roles: [],
        permissions: []
    });

    return {
        token,
        user: {
            id: savedUser.id,
            username: savedUser.username,
            email: savedUser.email,
            roles: [],
            permissions: []
        }
    };
};

export const loginUser = async (loginData: ILoginRequest): Promise<IAuthResponse> => {
    const { username, password } = loginData;

    // Find user with roles and permissions
    const user = await userRepository.findOne({
        where: { username },
        relations: ['roles', 'roles.permissions']
    });

    if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    // Extract roles and permissions
    const roles = user.roles?.map(role => role.name) || [];
    const permissions = user.roles?.flatMap(role => 
        role.permissions?.map(permission => `${permission.resource}:${permission.action}`) || []
    ) || [];

    // Generate token
    const token = generateToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        roles,
        permissions
    });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            roles,
            permissions
        }
    };
};

export const getUserProfile = async (userId: number) => {
    const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.permissions']
    });

    if (!user) {
        return null;
    }

    // Extract roles and permissions
    const roles = user.roles?.map(role => role.name) || [];
    const permissions = user.roles?.flatMap(role => 
        role.permissions?.map(permission => `${permission.resource}:${permission.action}`) || []
    ) || [];

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        roles,
        permissions
    };
};

export const getUserById = async (userId: number) => {
    return await userRepository.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.permissions']
    });
};
