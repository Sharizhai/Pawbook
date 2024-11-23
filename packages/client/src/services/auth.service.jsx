// class AuthService {
//     static getToken() {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('token')
//         }
//         return null
//     }

//     static setToken(token) {
//         if (typeof window !== 'undefined') {
//             localStorage.setItem('token', token)
//         }
//     }

//     static removeToken() {
//         if (typeof window !== 'undefined') {
//             localStorage.removeItem('token')
//         }
//     }

//     static isAuthenticated() {
//         if (typeof window !== 'undefined') {
//             return !!localStorage.getItem('token')
//         }
//         return false
//     }
// }

// export default AuthService;

class AuthService {
    static isRefreshing = false;
    static refreshSubscribers = [];
    static API_URL = import.meta.env.VITE_API_URL;

    static isAuthenticated() {
        if (typeof window !== 'undefined') {
            return document.cookie.includes('accessToken');
        }
        return false;
    }

    static async logout() {
        try {
            await fetch(`${this.API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            window.location.href = '/login';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            window.location.href = '/login';
        }
    }

    static async refreshToken() {
        try {
            const response = await fetch(`${this.API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Échec du rafraîchissement du token');
            }

            return true;
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            return false;
        }
    }

    static async handleTokenRefresh() {
        if (this.isRefreshing) {
            return new Promise(resolve => {
                this.refreshSubscribers.push(resolve);
            });
        }

        this.isRefreshing = true;

        try {
            const success = await this.refreshToken();
            this.isRefreshing = false;

            this.refreshSubscribers.forEach(callback => callback(success));
            this.refreshSubscribers = [];

            return success;
        } catch (error) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            return false;
        }
    }
}

export default AuthService;