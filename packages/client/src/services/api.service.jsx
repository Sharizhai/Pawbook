import AuthService from './auth.service';

const authenticatedFetch = async (url, options = {}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    // Si l'URL ne commence pas par http, on ajoute l'URL de base
    const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

    const fetchOptions = {
        ...options,
        credentials: "include",
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
        }
    };

    try {
        let response = await fetch(fullUrl, fetchOptions);

        if (response.status === 401) {
            const refreshSuccess = await AuthService.handleTokenRefresh();

            if (refreshSuccess) {
                response = await fetch(fullUrl, fetchOptions);
                
                if (response.status === 401) {
                    await AuthService.logout();
                    return response;
                }
            } else {
                await AuthService.logout();
            }
        }

        return response;
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
        throw error;
    }
};

export default authenticatedFetch;