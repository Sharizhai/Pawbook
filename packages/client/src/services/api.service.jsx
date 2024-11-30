import AuthService from './auth.service';

// const authenticatedFetch = async (url, options = {}) => {
//     const API_URL = import.meta.env.VITE_API_URL;
    
//     // Si l'URL ne commence pas par http, on ajoute l'URL de base
//     const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

//     const fetchOptions = {
//         ...options,
//         credentials: "include",
//         headers: {
//             ...options.headers,
//             "Content-Type": "application/json",
//         }
//     };

//     try {
//         let response = await fetch(fullUrl, fetchOptions);

//         if (response.status === 401) {
//             const refreshSuccess = await AuthService.handleTokenRefresh();

//             if (refreshSuccess) {
//                 response = await fetch(fullUrl, fetchOptions);
                
//                 if (response.status === 401) {
//                     // await AuthService.logout(); 
//                     return response;
//                 }
//             } else {
//                 // await AuthService.logout(); 
//             }
//         }

//         return response;
//     } catch (error) {
//         console.error("Erreur lors de la requête:", error);
//         throw error;
//     }
// };

const authenticatedFetch = async (url, options = {}) => {
    const token = AuthService.getToken();
    
    const fetchOptions = {
        ...options,
        credentials: 'include',
        // headers: {
        //     ...options.headers,
        //     'Authorization': `Bearer ${token}`
        // }
    };
    
    try {
        let response = await fetch(url, fetchOptions);
        
        if (response.status === 401) {
            const refreshSuccess = await AuthService.refreshToken();
            
            // if (refreshSuccess) {
            //     fetchOptions.headers['Authorization'] = `Bearer ${AuthService.getToken()}`;
            //     response = await fetch(url, fetchOptions);
            // } else {
            //     AuthService.removeToken();
            //     window.location.href = '/login';
            // }

            if (!refreshSuccess) {
                window.location.href = '/login';
            }
            
            response = await fetch(url, fetchOptions);
        }
        
        return response;
    } catch (error) {
        console.error('Erreur lors de la requête', error);
        throw error;
    }
};

export default authenticatedFetch;