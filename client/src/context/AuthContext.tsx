import { createContext, useContext, useState, type ReactNode } from "react";
import { useApi } from "./ApiContext";
import type { User } from "../models/User";

interface AuthContextReturns {
    loading: boolean;
    user: User | undefined;
    token: string | undefined;
    login: (email: string, password: string) => any;
    register: (email: string, password: string) => any;
    logout: () => void;
}

interface Props {
    children: ReactNode
}

const AuthContext = createContext<AuthContextReturns | null>(null);

export const AuthProvider = ({children}: Props) => {
    const serverApi = useApi();
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [token, setToken] = useState<string>()

    const login = async (email: string, password: string) => {
        if (!serverApi) return null;

        try{
            setLoading(true)
            const response = await serverApi.post('/auth/login', {email, password});

            if(response.status === 200){
                setUser(response.data);
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token)
                return {
                    user,
                    token
                }
            }

            return null;
        } catch (error) {
            console.error("Errore login axios: ", error)
            return null;
        } finally {
            setLoading(false)
        }
    }

    const register = async (email: string, password: string) => {
        if (!serverApi) return null;

        try{
            setLoading(true)
            const response = await serverApi.post('/auth/register', {email, password});

            if(response.status === 201){
                return response.data
                
            }
            return null;
        } catch (error) {
            console.error("Errore registrazione axios: ", error)
            return null;
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        try {
            setLoading(true);

            localStorage.removeItem('token');
            setUser(undefined);
            setToken(undefined);
        } catch (error) {
            console.error("Errore logout: ", error)
            return null;
        } finally {
            setLoading(false)
        }
    }


    return (
        <AuthContext.Provider value={{loading, user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);