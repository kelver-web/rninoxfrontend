import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(username, password); // <- já retorna true/false
    if (success) {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard/kanban");
    } else {
     
      console.warn("Falha no login");
    }
  };

  return (
    <section className="flex items-center justify-center" style={{ backgroundColor: '#F8F8FF', minHeight: '100vh'}}>
      <div className="w-full lg:w-3/5 mt-18">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            <span className="text-blue-gray-900">RN Inox</span>
            <span className="text-blue-gray-500"> - Sistema de Gerenciamento de Tarefas</span>
          </Typography>
          <Typography variant="h5" className="mb-2">
            Bem-vindo de volta!
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Insira seu nome de usuário e senha para entrar.
          </Typography>
        </div>

        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" className="-mb-3 font-medium">
              Seu nome de usuário
            </Typography>
            <Input
              type="text"
              size="lg"
              label="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Typography variant="small" className="-mb-3 font-medium">
              Senha
            </Typography>
            <Input
              type="password"
              size="lg"
              label="Senha"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Entrar
          </Button>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
