class AuthService {
    static isRefreshing = false;
    static refreshSubscribers = [];
    static API_URL = import.meta.env.VITE_BASE_URL;

    static async isAuthenticated() {
        if (typeof window !== 'undefined') {
            try {
                const API_URL = import.meta.env.VITE_BASE_URL;
                const response = await fetch(`${API_URL}/users/verifyLogin`, {
                    method: 'GET',
                    credentials: 'include',
                });

                console.log("Réponse brute :", response);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Utilisateur authentifié :", data);
                    return true;
                } else {
                    console.warn("Utilisateur non authentifié :", await response.json());
                    return false;
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de l'authentification :", error);
                return false;
            }
        }
        return false; // Par sécurité, false si appelé côté serveur
    }

    static async logout() {
        try {
            await fetch(`${this.API_URL}/users/logout`, {
                method: 'GET',
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

    static async logout() {
        const API_URL = import.meta.env.VITE_BASE_URL;
    
        try {
            await fetch(`${API_URL}/users/logout`, {
                method: 'GET',
                credentials: 'include'
            });
    
            this.removeToken();
            
            window.location.href = '/login';
        } catch (error) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            return false;
        }
    }
}

export default AuthService;