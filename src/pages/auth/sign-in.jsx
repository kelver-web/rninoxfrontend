import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(username, password);
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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                label="Senha"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
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
