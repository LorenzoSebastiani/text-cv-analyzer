import type { AxiosInstance } from "axios";
import axios from "axios";
import { createContext, useContext, type ReactNode } from "react";

interface Props {
    children: ReactNode
}

const ApiContext = createContext<AxiosInstance | null>(null)

const serverApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
})

serverApi.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return config;
    },
    (error) => Promise.reject(error)
)

serverApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Utente non autorizzato, reindirizzamento al login...');
        }
        return Promise.reject(error);
    }
);

export const ApiProvider = ({ children }: Props) => {
    return (
        <ApiContext.Provider value={serverApi}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => useContext(ApiContext);