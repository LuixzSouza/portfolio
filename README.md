<div align="center">

# Luiz Souza — Portfólio

**Portfólio pessoal em 13 idiomas, com painel administrativo próprio para editar todo o conteúdo sem mexer no código.**

[![Site](https://img.shields.io/badge/Site-luixzsouza.com.br-14110f?style=for-the-badge)](https://luixzsouza.com.br)

![Next.js](https://img.shields.io/badge/Next.js_15-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

</div>

---

## ✨ Destaques

- **Design editorial, dark-first**: tipografia grande (Playfair Display + Roobert), tema claro/escuro e animações com Framer Motion (preloader, transição de páginas, cursores e reveals).
- **13 idiomas** com troca instantânea: PT, EN, ES, FR, DE, IT, ZH, JA, RU, AR (RTL), HI, KO e ID.
- **Projetos com estudos de caso**: galerias com prints reais, lightbox navegável pelo teclado e repositórios públicos do GitHub mesclados automaticamente.
- **Painel admin (CRUD)** em `/admin`: projetos, certificados, depoimentos, trajetória, skills, serviços e textos do "Sobre", com upload de imagem e reordenação por arrastar e soltar.
- **SEO**: metadata e canonical por página, Open Graph, JSON-LD (Person, CreativeWork, Service, credenciais), sitemap e robots.
- **Acessibilidade**: skip link, foco visível, menu com `inert`/Escape e regiões `aria-live`, com rótulos traduzidos.

## 🏛️ Arquitetura

```
Next.js (output: "export")  →  HTML/CSS/JS estático na Hostinger
        │ fetch no cliente
        ▼
API PHP (/php/api/*.php?action=…)  →  MySQL
```

- O front é **exportado estaticamente**: não há Node em produção.
- O conteúdo vive em `src/data/` e `src/content/` (tipado com Zod) e é usado no build. No navegador, os componentes buscam a versão atualizada na API e **mantêm o conteúdo estático se a API falhar**.
- Os schemas Zod em `src/lib/schemas/` são a fonte de verdade: geram os tipos e validam as respostas da API. Testes de contrato garantem o formato do PHP.
- A API usa sessão por cookie e CSRF nas rotas de escrita. Credenciais ficam em `php/config.php`, fora do Git.

## 🚀 Rodando localmente

```bash
git clone https://github.com/LuixzSouza/portfolio.git
cd portfolio
npm install
npm run dev          # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Ambiente de desenvolvimento (cache em `.next-dev`) |
| `npm run build` | Build + export estático em `out/` (inclui o backend em `out/php`) |
| `npm run lint` | ESLint (flat config) |
| `npm run test:run` | Testes (Vitest + Testing Library) |
| `npm run test:types` | Type-check dos testes |
| `npm run clean` | Apaga `.next`, `.next-dev` e `out` |

## 📦 Deploy (Hostinger)

1. `npm run build` gera `out/` com o site e a API PHP (sem `config.php` e sem SQL).
2. Envie o **conteúdo** de `out/` para `public_html`.
3. No servidor, mantenha `public_html/php/config.php` (modelo em `src/php/config.example.php`).
4. Banco: importe `src/php/sql/schema.sql` e `seed.sql` (gerado por `scripts/generate-seed.mts`).

## 📂 Estrutura

```
src/
  app/[locale]/        rotas por idioma: home, work, project, services, certificates, about, contact
  app/admin/           painel administrativo
  components/          ds/ (design system), layout/, sections/, admin/
  content/             dicionários dos 13 idiomas
  data/                projetos, serviços, certificados, skills… (fallback estático)
  lib/                 api, schemas Zod, i18n, SEO
  php/                 API PHP, PHPMailer e SQL
cv/                    currículo (PT/EN) e READMEs de projetos
```

## 👤 Autor

**Luiz Antônio de Souza**, Desenvolvedor Full Stack
[Portfólio](https://luixzsouza.com.br) · [LinkedIn](https://www.linkedin.com/in/luiz-antonio-souza-5000a226b/) · [GitHub](https://github.com/LuixzSouza) · luiz.antoniodesouza004@gmail.com
