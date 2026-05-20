# Frontend — Cabeleleila Leila

Interface web do salão para os clientes fazerem agendamentos online.

## Tecnologias

- **React 19** com **TypeScript**
- **Vite** — dev server rápido e build
- **React Router** — navegação entre páginas
- **Tailwind CSS** — estilização com classes utilitárias

## Como rodar

```bash
cd Front/frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O backend precisa estar rodando em `http://localhost:3333`.

> O Vite faz proxy automático: requisições para `/api/*` são redirecionadas para o backend.

## Páginas

| Caminho                      | Descrição                                      |
| ---------------------------- | ---------------------------------------------- |
| `/login`                     | Tela de login                                  |
| `/signup`                    | Criar conta nova                               |
| `/home`                      | Agendamento — escolher serviços, data, horário |
| `/appointments`              | Histórico de agendamentos                      |
| `/appointments/:id/detalhes` | Detalhes de um agendamento                     |

## Fluxo do usuário

1. **Cadastro** (`/signup`) — nome, email, telefone, senha
2. **Login** (`/login`) — token JWT salvo no navegador
3. **Agendamento** (`/home`):
   - Escolhe os serviços → escolhe a data → vê horários disponíveis → confirma
   - Se já tiver agendamento na mesma semana, aparece um aviso sugerindo juntar
4. **Histórico** (`/appointments`) — vê agendamentos passados/futuros, filtra por data e status
5. **Detalhes** (`/appointments/:id/detalhes`):
   - Cliente vê informações e pode reagendar (se faltarem +2 dias)
   - Admin pode mudar status (PENDENTE, CONFIRMADO, CONCLUIDO, CANCELADO)

## Regras no frontend

- **Reagendamento bloqueado** se faltam menos de 2 dias — mensagem orienta ligar
- **Aviso semanal** — hook consulta se já existe agendamento na semana
- **Visão admin vs cliente** — admin vê busca por cliente e botões de status
- **Formatação**: datas em pt-BR, preços em R$

## Credenciais de teste

- Admin: `leila@email.com` | `admin123`
- Cliente: criar no fluxo de singup

## .env

```bash
VITE_API_URL=http://localhost:3333
```

## Scripts

```bash
npm run dev       # Desenvolvimento (http://localhost:5173)
npm run build     # Build para produção (pasta dist/)
npm run preview   # Testar a build localmente
```
