class AuthService {
    static getToken() {
        if (typeof window !== 'undefined') {
            const cookieToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];

            const localToken = localStorage.getItem('token');

            return cookieToken || localToken || null;
        }
        return null;
    }

    static setToken(token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    static removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');

            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }

    static isAuthenticated() {
        if (typeof window !== 'undefined') {
            return !!this.getToken();
        }
        return false;
    }
}

export default AuthService;