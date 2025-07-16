import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react";


export default function List() {
    const { isAuthenticated, user, requireLogin } = useAuth();

    useEffect(requireLogin, [isAuthenticated]);

    return (
        <>
        </>
    )
}