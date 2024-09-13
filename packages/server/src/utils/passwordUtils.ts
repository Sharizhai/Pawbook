import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string | undefined> {
    try {
        const hashPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            hashLength: 32,
            timeCost: 4,
            memoryCost: 1024,
            parallelism: 2,
        });

        return hashPassword;
    } catch (error : unknown) {
        console.error('error hashing password:', error);
        return;
    }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await argon2.verify(hashedPassword, password);
    } catch (error) {
        console.error('error verifying password:', error);
        return false;
    }
}