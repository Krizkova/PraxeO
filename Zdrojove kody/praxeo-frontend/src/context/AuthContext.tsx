import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import Cookies from "js-cookie";
import { getCurrentUser } from "../api/userApi";

type AuthUser = {
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
};

type AuthContextType = {
    isLoggedIn: boolean;
    user: AuthUser | null;
    loading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Obnovení přihlášení po refreshi stránky
    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get("token");

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                Cookies.remove("token", { path: "/" });
                Cookies.remove("userEmail", { path: "/" });
                Cookies.remove("userRole", { path: "/" });
                Cookies.remove("userName", { path: "/" });
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Uložení tokenu a uživatele po úspěšném loginu
    const login = (token: string, userData: AuthUser) => {
        Cookies.set("token", token, { expires: 1, path: "/" });
        Cookies.set("userEmail", userData.email, { path: "/" });
        Cookies.set("userRole", userData.role, { path: "/" });
        Cookies.set("userName", userData.firstName || "", { path: "/" });
        setUser(userData);
    };

    // Vymazání session dat při logoutu
    const logout = () => {
        Cookies.remove("token", { path: "/" });
        Cookies.remove("userEmail", { path: "/" });
        Cookies.remove("userRole", { path: "/" });
        Cookies.remove("userName", { path: "/" });
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!user,
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Vlastní hook pro práci s autentizací
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};