import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card";
import Input from "../../components/input";
import Button from "../../components/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    console.log({ email, password });
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Card>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Login</h1>

          <p className="text-slate-400 mt-2">Entre para acessar o sistema</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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

          <Button type="submit" title="Entrar" />

          <Button
            type="button"
            title="Cadastrar"
            onClick={() => navigate("/signup")}
          />
        </form>
      </Card>
    </div>
  );
};

export default Login;
