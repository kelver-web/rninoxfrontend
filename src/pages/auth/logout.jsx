import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";


const Logout = () => {
    const { logout } = useAuth(); // Precisa do useAuth aqui
    useEffect(() => {
        logout(); // Chama logout assim que o componente é montado
    }, [logout]);
    return null; // Não renderiza nada
};

export default Logout;

