# CV & Deliverables — Luiz Souza

Materiais de candidatura gerados fora do site (não entram no build do Next).

## Arquivos

| Arquivo | O que é |
|---|---|
| `curriculo-luiz-souza.html` / `.pdf` | **Currículo base 2026 (PT-BR)**, cópia de `Área de Trabalho/Currículo 2026/_fonte/curriculo-base.html` |
| `curriculo-luiz-souza-en.html` / `.pdf` | **Résumé (EN)**, tradução fiel da base, mesmo layout |
| `foto.jpg` | Foto usada pelos dois HTMLs |
| `readmes/Silver-Ocean-README.md` | README do projeto Silver Ocean (stack conferida no repositório) |
| `readmes/Berilo-Cafe-README.md` | README do projeto Berilo Café (stack conferida no repositório) |

O botão "Baixar currículo" do site serve `public/cv/curriculo-luiz-souza.pdf` (PT) e
`public/cv/curriculo-luiz-souza-en.pdf` (demais idiomas); ver `src/lib/cv.ts`.

## Atualizar o currículo

1. Edite a base na Área de Trabalho (`Currículo 2026/_fonte/curriculo-base.html`) e gere o PDF de lá.
2. Copie o HTML e o PDF para cá (`curriculo-luiz-souza.*`) e o PDF para `public/cv/`.
3. Aplique as mesmas mudanças no `curriculo-luiz-souza-en.html` e gere o PDF:
   Chrome/Edge → **Ctrl+P** → "Salvar como PDF", margens **Nenhuma**, **"Gráficos de plano de fundo"** marcado.
4. Confira: **1 página** e texto selecionável (ATS).

## Regras

- Nunca citar a Turn.io nem os projetos dela no currículo.
- E-mail de contato: luiz.antoniodesouza004@gmail.com.
