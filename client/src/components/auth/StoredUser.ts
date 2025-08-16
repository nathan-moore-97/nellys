export interface StoredUser {
    firstName: string,
    lastName: string,
    roleId: number,
    username: string,
}

// Type guard for StoredUser
export function isStoredUser(data: unknown): data is StoredUser {
    if (typeof data !== 'object' || data === null) return false;

    const user = data as Partial<StoredUser>;

    // Validate required fields
    if (typeof user.firstName !== 'string' || user.firstName.trim().length === 0) {
        return false;
    }

    if (typeof user.lastName !== 'string' || user.lastName.trim().length === 0) {
        return false;
    }

    if (typeof user.roleId !== 'number' || !Number.isInteger(user.roleId) || user.roleId <= 0) {
        return false;
    }

    if (typeof user.username !== 'string' || user.username.trim().length === 0) {
        return false;
    }

    return true;
}