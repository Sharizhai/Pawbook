class AuthService {
    static getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token')
        }
        return null
    }

    static setToken(token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token)
        }
    }

    static removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
        }
    }

    static isAuthenticated() {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token')
        }
        return false
    }
}

export default AuthService;