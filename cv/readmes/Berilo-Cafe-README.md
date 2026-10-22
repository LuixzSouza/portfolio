<!--
  README — Berilo Café
  Já preenchido com o que é verificável no site ao vivo (berilocafe.com.br).
  Stack e decisões conferidas no repositório (package.json, next.config e README do projeto).
  Coloque este arquivo na RAIZ do repositório como README.md
-->

<div align="center">

# ☕ Berilo — Cafés Especiais

**E-commerce de cafés especiais com torra artesanal em micro-lotes: catálogo, contas de cliente e a história do grão do Campo das Vertentes (MG) para todo o Brasil.**

[![Demo](https://img.shields.io/badge/Loja-ao_vivo-14110f?style=for-the-badge)](https://berilocafe.com.br)
[![Repo](https://img.shields.io/badge/Código-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/LuixzSouza/berilo-cafe-ecommerce)

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

</div>

---

## ✨ Sobre

**Berilo** é uma loja virtual de cafés especiais de uma torrefação artesanal da região do
Campo das Vertentes, em Minas Gerais. O site conta a história do produto — origem rastreável
e torra em micro-lotes semanais — e leva o cliente do catálogo à compra com uma experiência
limpa, sofisticada e responsiva.

> *"A Arte do Café Especial — do Campo das Vertentes para o Brasil, a alma de Minas em cada grão."*

> **Por que construí:** projeto para cliente real — uma torrefação de Minas Gerais que precisava vender online para todo o Brasil, com pagamento, frete, etiquetas e painel próprio para operar a loja.

## 🔗 Acesso rápido

| | |
|---|---|
| 🌐 **Loja ao vivo** | https://berilocafe.com.br |
| 💻 **Repositório** | https://github.com/LuixzSouza/berilo-cafe-ecommerce |
| 🎨 **Design (Figma)** | — |

## 🧩 Funcionalidades

- **Catálogo de cafés** — seleções em destaque + catálogo completo ("Nossos Cafés").
- **Página institucional** — "Sobre Nós" com a história da torrefação e da origem dos grãos.
- **Contas de cliente** — login/autenticação.
- **Checkout** com Mercado Pago (Pix, cartão e boleto) e **frete calculado** via Melhor Envio e Correios.
- **Painel administrativo** — produtos, pedidos, clientes, etiquetas e logística reversa.
- **Contato** dedicado e **FAQ** respondendo as dúvidas mais comuns.
- **Diferenciais de produto** — torra em micro-lotes semanais, logística com embalagem protetora e garantia de devolução incondicional.
- **Prova social** — avaliações (4.9 no Google).
- 📱 **Responsivo** e otimizado para performance (imagens em WebP) e SEO.

## 🛠️ Tecnologias

**Front-end:** Next.js (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Zustand · React Hook Form + Zod
**Back-end / Dados:** Supabase (PostgreSQL + Auth, com RLS) · APIs PHP em `public/api` (pagamento, frete, e-mail com PHPMailer)
**Pagamentos / Integrações:** Mercado Pago · Melhor Envio · Correios (frete, rastreio e logística reversa) · React PDF (etiquetas e recibos)
**Infra / Deploy:** export estático do Next.js + APIs PHP na Hostinger
**Testes:** Vitest + Testing Library · PHPUnit (APIs PHP) · testes de integração
**Ferramentas:** Figma · Git

## 📸 Screenshots

<div align="center">
  <img src="docs/screenshot-home.png" alt="Vitrine do Berilo Café" width="80%" />
</div>

## 🏛️ Decisões técnicas

- **Front estático + PHP para o que precisa de segredo** — o site é exportado como HTML estático (rápido e barato de hospedar), e tudo que envolve credenciais (Mercado Pago, Correios, e-mail) roda em endpoints PHP no mesmo servidor, sem expor chaves no navegador.
- **Autenticação e segurança** — Supabase Auth para clientes e admins, com Row Level Security no Postgres: cada cliente só lê os próprios pedidos e só o papel `admin` altera produtos. As mudanças de schema ficam versionadas em migrations SQL.
- **Performance & SEO** — páginas geradas no build (SSG), mídia otimizada por script (WebP) e dados estruturados (JSON-LD tipado com `schema-dts`) para SEO.

## 🚀 Rodando localmente

```bash
git clone https://github.com/LuixzSouza/berilo-cafe-ecommerce.git
cd berilo-cafe
npm install
# crie .env.local com as chaves do Supabase e do Mercado Pago
npm run dev
# http://localhost:3000
```

## 👤 Autor

**Luiz Antônio de Souza** — Desenvolvedor Full-Stack
[Portfólio](https://luixzsouza.com.br) · [LinkedIn](https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/) · [GitHub](https://github.com/LuixzSouza)
