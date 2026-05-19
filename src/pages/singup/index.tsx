import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card";
import Input from "../../components/input";
import Button from "../../components/button";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUp = () => {
    console.log({
      name,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Card>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Criar conta</h1>

          <p className="text-slate-400 mt-2">
            Cadastre-se para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <Input
            label="Nome"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

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

          <Button type="submit" title="Criar conta" />

          <Button
            type="button"
            title="Voltar"
            onClick={() => navigate("/login")}
          />
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
