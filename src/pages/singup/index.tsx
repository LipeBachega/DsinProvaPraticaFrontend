import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card";
import Input from "../../components/input";
import Button from "../../components/button";
import { useSignUp } from "../../hooks/use-signup";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { isLoading, errorMessage, fieldErrors, submit } = useSignUp();

  const handleSignUp = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await submit({
      name,
      email,
      phone,
      password,
    });

    if (response?.success) {
      navigate("/login", {
        state: {
          successMessage: "Conta criada com sucesso. Agora voce ja pode entrar.",
        },
      });
    }
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

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <Input
            label="Nome"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {fieldErrors.name && (
            <p className="-mt-3 text-sm text-rose-300">{fieldErrors.name}</p>
          )}

          <Input
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {fieldErrors.email && (
            <p className="-mt-3 text-sm text-rose-300">{fieldErrors.email}</p>
          )}

          <Input
            label="Telefone"
            type="tel"
            placeholder="Digite seu telefone com DDD"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {fieldErrors.phone && (
            <p className="-mt-3 text-sm text-rose-300">{fieldErrors.phone}</p>
          )}

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {fieldErrors.password && (
            <p className="-mt-3 text-sm text-rose-300">{fieldErrors.password}</p>
          )}

          <Button
            type="submit"
            title={isLoading ? "Criando conta..." : "Criar conta"}
            disabled={isLoading}
          />

          <Button
            type="button"
            title="Voltar"
            disabled={isLoading}
            onClick={() => navigate("/login")}
          />
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
