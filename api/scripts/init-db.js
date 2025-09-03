// scripts/init-db.js
// Este script cria o DATABASE 'tunetrade' e a tabela 'pessoas' usando os
// dados do seu .env. Assim você não precisa do cliente mysql no terminal.

require('dotenv').config();                    // carrega .env
const mysql = require('mysql2/promise');       // driver MySQL com promises

(async () => {
  // Lê as configs do .env (com defaults sensatos)
  const HOST = process.env.DB_HOST || '127.0.0.1';
  const PORT = Number(process.env.DB_PORT) || 3306;
  const USER = process.env.DB_USUARIO || 'root';
  const PASS = process.env.DB_SENHA || '';
  const DB   = process.env.DB_NOME || 'tunetrade';

  console.log('[INIT-DB] Conectando ao MySQL em', `${HOST}:${PORT}`, 'como', USER);

  // 1) Conecta SEM database selecionado (para poder criar o DB)
  const conn = await mysql.createConnection({
    host: HOST,
    port: PORT,
    user: USER,
    password: PASS,
    multipleStatements: true, // permite executar vários comandos de uma vez
  });

  // 2) Cria o DATABASE (se não existir) com UTF-8 completo
  const createDbSQL = `
    CREATE DATABASE IF NOT EXISTS \`${DB}\`
      DEFAULT CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
  `;
  await conn.query(createDbSQL);
  console.log(`[INIT-DB] Database '${DB}' ok.`);

  // 3) Seleciona o database
  await conn.changeUser({ database: DB });

  // 4) Cria a tabela 'pessoas' (se não existir) e índices
  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS pessoas (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nome       VARCHAR(120) NOT NULL,
      cidade     VARCHAR(120) NOT NULL,
      telefone   VARCHAR(30)  NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_pessoas_nome   ON pessoas (nome);
    CREATE INDEX IF NOT EXISTS idx_pessoas_cidade ON pessoas (cidade);
  `;

  // Observação: algumas versões não aceitam "IF NOT EXISTS" em CREATE INDEX.
  // Se a sua reclamar, pode ignorar erro com try/catch ou remover o IF NOT EXISTS.
  try {
    await conn.query(createTablesSQL);
  } catch (e) {
    // fallback se sua versão não aceitar IF NOT EXISTS nos índices
    if (String(e.message).includes('IF NOT EXISTS')) {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS pessoas (
          id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          nome       VARCHAR(120) NOT NULL,
          cidade     VARCHAR(120) NOT NULL,
          telefone   VARCHAR(30)  NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);
      // tenta criar índices simples (se já existirem, MySQL vai reclamar, mas é inofensivo)
      try { await conn.query(`CREATE INDEX idx_pessoas_nome   ON pessoas (nome);`); } catch(_) {}
      try { await conn.query(`CREATE INDEX idx_pessoas_cidade ON pessoas (cidade);`); } catch(_) {}
    } else {
      throw e;
    }
  }

  console.log("[INIT-DB] Tabela 'pessoas' ok.");

  // 5) (Opcional) Insere um registro de teste caso a tabela esteja vazia
  const [rows] = await conn.query(`SELECT COUNT(*) AS total FROM pessoas;`);
  if (rows[0].total === 0) {
    await conn.query(
      `INSERT INTO pessoas (nome, cidade, telefone)
       VALUES ('Teste Inicial', 'Sua Cidade', '(00) 00000-0000');`
    );
    console.log("[INIT-DB] Registro de teste inserido.");
  }

  await conn.end();
  console.log('[INIT-DB] Finalizado com sucesso ✅');
})().catch(err => {
  console.error('[INIT-DB] ERRO:', err.message);
  process.exit(1);
});
