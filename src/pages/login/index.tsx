import { useState, type SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/card";
import Input from "../../components/input";
import Button from "../../components/button";
import { useLogin } from "../../hooks/use-login";

const Login = () => {
  // O estado local guarda apenas os valores digitados; a chamada da API fica no hook.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, errorMessage, submit } = useLogin();

  const successMessage = location.state?.successMessage as string | undefined;

  const handleLogin = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Se a API autenticar, seguimos para a home principal do sistema.
    const response = await submit({ email, password });

    if (response?.success) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Card>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Login</h1>

          <p className="text-slate-400 mt-2">Entre para acessar o sistema</p>
        </div>

        {successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Cada input reflete diretamente o estado do formulário. */}
          <Input
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button type="submit" title={isLoading ? "Entrando..." : "Entrar"} disabled={isLoading} />

          <Button
            type="button"
            title="Cadastrar"
            disabled={isLoading}
            onClick={() => navigate("/signup")}
          />
        </form>
      </Card>
    </div>
  );
};

export default Login;
