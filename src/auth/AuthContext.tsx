import { createContext, useContext, type ReactNode } from "react";
import type { MeResponse } from '../api/types';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../api/token";

type AuthContextType = {
    user: MeResponse | undefined,
    isLoading: boolean,
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: getMe,
    });
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const logout = () => {
        removeToken();
        queryClient.clear();
        navigate('/login')
    }
    return (
        <AuthContext.Provider value={{ user: data, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
}
