import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
    [key: string]: unknown;
}

export function isTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
        const decoded: JwtPayload = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}
