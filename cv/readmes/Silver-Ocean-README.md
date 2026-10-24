<!--
  README — Silver Ocean
  Já preenchido com o que é verificável no site ao vivo (silverocean925.com.br).
  Stack e decisões conferidas no repositório (package.json + README do projeto).
  Coloque este arquivo na RAIZ do repositório como README.md
-->

<div align="center">

# 💍 Silver Ocean — Joias em Prata 925

**E-commerce completo de joias em prata 925: catálogo, carrinho, contas de cliente, rastreio de pedidos e checkout com Pix e cartões.**

[![Demo](https://img.shields.io/badge/Loja-ao_vivo-14110f?style=for-the-badge)](https://silverocean925.com.br)
[![Repo](https://img.shields.io/badge/Código-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/LuixzSouza/Silver-Ocean)

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)

</div>

---

## ✨ Sobre

**Silver Ocean** é uma loja virtual de joias em prata 925 voltada ao público brasileiro,
com foco em design exclusivo, autenticidade garantida e garantia vitalícia. O projeto
cobre toda a jornada de compra — da vitrine ao pagamento — em uma interface elegante,
minimalista e responsiva.

> *"Eternizando momentos através de joias com design exclusivo e garantia vitalícia."*

> **Por que construí:** projeto para cliente real — uma marca de joias em prata que precisava de loja própria, integrada ao ERP que já usava (Jueri), com painel para operar estoque, pedidos e revenda consignada.

## 🔗 Acesso rápido

| | |
|---|---|
| 🌐 **Loja ao vivo** | https://silverocean925.com.br |
| 💻 **Repositório** | https://github.com/LuixzSouza/Silver-Ocean |
| 🎨 **Design (Figma)** | — |

## 🧩 Funcionalidades

- **Catálogo por categorias** — anéis, colares, brincos, pulseiras, linha masculina e peças personalizadas.
- **Carrinho de compras** com fluxo de checkout completo.
- **Contas de cliente** — login, cadastro e lista de favoritos (wishlist).
- **Rastreamento de pedidos** integrado.
- **Pagamentos** via Pix, Visa, Mastercard, Amex, Elo e Hipercard.
- **Frete grátis** para todo o Brasil em compras acima de R$ 499.
- **Prova social** — avaliações de clientes (4.9/5, 857+ reviews verificados).
- **Newsletter** — captura de leads pelo "Club Silver Ocean".
- 📱 **Responsivo** e otimizado para performance (imagens em WebP) e SEO.

## 🛠️ Tecnologias

**Front-end:** Next.js (App Router) · React 19 · TypeScript (strict) · Tailwind CSS · React Hook Form + Zod · Recharts
**Back-end / Dados:** Supabase (PostgreSQL + Auth com login Google) · endpoints PHP em `public/api` · integração com o ERP Jueri
**Pagamentos:** Mercado Pago (Pix e cartões) + fluxo de venda assistida via WhatsApp
**Infra / Deploy:** export estático → GitHub Actions → FTP → Hostinger
**Testes:** Vitest + Testing Library · Playwright (E2E)
**Ferramentas:** Figma · Git

## 📸 Screenshots

<div align="center">
  <img src="docs/screenshot-home.png" alt="Vitrine do Silver Ocean" width="80%" />
</div>

## 🏛️ Decisões técnicas

- **Hub híbrido ERP + Supabase** — os produtos vêm do ERP legado (Jueri) para manter o estoque sincronizado, enquanto usuários, pedidos, cupons e o módulo de revenda ficam no Supabase. Data mappers (`mapJueriToAppProduct` / `mapSupabaseToAppProduct`) normalizam as duas fontes antes de chegar à UI.
- **Dois fluxos de compra** — checkout via Mercado Pago (Pix e cartões) e pedido formatado enviado ao WhatsApp do vendedor para venda assistida, que é como boa parte dos clientes da marca prefere comprar.
- **Performance & SEO** — vitrine 100% estática (`force-static` + `generateStaticParams`) e imagens em WebP. Um botão "Sincronizar site" no painel dispara, via webhook PHP, um rebuild no GitHub Actions (~3 min) que publica o catálogo atualizado na Hostinger.

## 🚀 Rodando localmente

```bash
git clone https://github.com/LuixzSouza/Silver-Ocean.git
cd silver-ocean
npm install
cp .env.example .env.local   # chaves do Supabase e do Mercado Pago
npm run dev
# http://localhost:3000
```

## 👤 Autor

**Luiz Antônio de Souza** — Desenvolvedor Full-Stack
[Portfólio](https://luixzsouza.com.br) · [LinkedIn](https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/) · [GitHub](https://github.com/LuixzSouza)
