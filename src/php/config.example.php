<?php
/**
 * Modelo de configuração do backend (e-mail + CMS).
 *
 * 1. Copie este arquivo para `config.php` (que é ignorado pelo Git).
 * 2. Preencha o config.php com as credenciais REAIS — NUNCA versione senhas/tokens.
 *    Este arquivo (.example) É versionado: mantenha SOMENTE placeholders aqui.
 *
 * Em produção, o config.php fica em `public_html/php/config.php`, compartilhado
 * pelo sendEmail.php e pela API (php/api/*).
 */

return [
    // --- SMTP (formulário de contato) ---
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_user' => 'COLOQUE_O_USUARIO_SMTP',
    'smtp_pass' => 'COLOQUE_A_SENHA_SMTP',
    'smtp_port' => 465,
    'mail_to'   => 'luiz.antoniodesouza004@gmail.com',

    // --- Banco de dados (CMS) ---
    'db_host'    => 'localhost',          // na Hostinger costuma ser 'localhost'
    'db_name'    => 'NOME_DO_BANCO',
    'db_user'    => 'USUARIO_DO_BANCO',
    'db_pass'    => 'SENHA_DO_BANCO',
    'db_charset' => 'utf8mb4',

    // --- Admin do painel ---
    // admin_pass é usado SOMENTE pelo setup-admin.php para gerar o hash bcrypt.
    'admin_user' => 'luiz',
    'admin_pass' => 'TROQUE_POR_UMA_SENHA_FORTE',

    // --- Segurança ---
    'setup_token'    => 'GERE_UM_TOKEN_ALEATORIO_LONGO', // exigido pelo setup-admin.php
    'allowed_origin' => '', // '' = mesma origem (produção). Em dev: 'http://localhost:3000'
];
