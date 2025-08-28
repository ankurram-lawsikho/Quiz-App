export interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
    isActive: boolean;
    roles?: IRole[];
}

export interface IRole {
    id: number;
    name: string;
    description?: string;
    permissions?: IPermission[];
    users?: IUser[];
}

export interface IPermission {
    id: number;
    name: string;
    description?: string;
    resource: string;
    action: string;
    roles?: IRole[];
}

export interface ILoginRequest {
    username: string;
    password: string;
}

export interface IRegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface IJwtPayload {
    userId: number;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
}

export interface IAuthResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
        roles: string[];
        permissions: string[];
    };
}
