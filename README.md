# Diagnóstico — Auditoria de Ativos Digitais

Plataforma interna (privada) para cadastrar clientes e acompanhar, item a item, o checklist do diagnóstico digital.
Acesso restrito a e-mails `@eduardometinger.com`.

**Stack:** Next.js 16 · Supabase (Auth + Postgres) · Vercel (deploy)

## O que está incluso no diagnóstico

- **Site institucional:** proposta de valor, WhatsApp, rastreamento (Pixel/GTM), CTAs, prova social, indexação no Google Search e velocidade.
- **Instagram:** bio, link, destaques, frequência de publicação e social selling.
- **Google Meu Negócio:** reivindicação do perfil, score (via ferramenta), avaliações, fotos e uso da aba de novidades.
- **Business Manager:** alerta de risco sobre propriedade das contas de anúncio, pixel e páginas.

O checklist completo está em [`checklist-diagnostico.md`](checklist-diagnostico.md) e, no app, em [`src/lib/checklist.ts`](src/lib/checklist.ts).

## Configuração (uma vez)

1. **Variáveis de ambiente:** copie `.env.example` para `.env.local` e preencha com os dados de Supabase → Project Settings → API.
2. **Banco de dados:** no Supabase, abra **SQL Editor → New query**, cole o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) e clique em **Run**.
3. **URLs de autenticação:** em Supabase → Authentication → URL Configuration:
   - **Site URL:** `http://localhost:3000` (depois, troque pela URL da Vercel)
   - **Redirect URLs:** adicione `http://localhost:3000/auth/callback` (e, depois, `https://SEU-DOMINIO/auth/callback`)

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000, clique em **Criar conta**, confirme o e-mail e entre.

## Segurança

- Cadastro bloqueado para qualquer e-mail fora de `@eduardometinger.com`: no app e no próprio banco (trigger em `auth.users`).
- Todas as tabelas usam Row Level Security: só usuários logados do domínio leem ou alteram dados.
- Confirmação de e-mail obrigatória (prova que a pessoa tem acesso à caixa do domínio).

## Estrutura

```
src/
  proxy.ts                  # renova a sessão e manda quem não está logado para /login
  lib/checklist.ts          # modelo do checklist (etapas, grupos e itens)
  lib/auth.ts               # validação de usuário e domínio
  app/login/                # login e criação de conta
  app/auth/callback/        # confirmação de e-mail
  app/clientes/             # lista, cadastro e checklist de cada cliente
supabase/migrations/        # SQL do banco
```
