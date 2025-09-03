const mysql = require ('mysql2/promise'); // importa o driver mysql2 com suporte a Promises (async/await)

const {banco} = require ('../configuracoes/ambiente'); // importa as configurações (host, usuário, senha, database) do arquivo ambiente.js
console.log('CFG banco:', banco);
const pool = mysql.createPool({ // cria um "pool" de conexões (reaproveita conexões ao invés de abrir/fechar sempre)
    host: banco.host,
    port: banco.porta,        // porta do MySQL (ex.: 3306)
    user: banco.usuario,      // usuário do MySQL (ex.: root ou app_user)
    password: banco.senha,    // senha do database (ex.: TunerTr@de)
    database: banco.nome,     // nome do database (ex.: tunetrade)
    waitForConnections: true, // se todas as conexões estiverem ocupadas, entra numa fila
    connectionLimit: 10,      // número máximo de conexões simultâneas no pool
    queueLimit: 0,            // 0 = sem limite de espera na fila
    namedPlaceholders: true,  // permite usar parâmetros nomeados :campo nas queries
});

async function executar(sql, parametros = {}) {
    const conn = await pool.getConnection();
    try {
        const [ linhas ] = await conn.execute(sql, parametros);
        return linhas;
    } finally {
        conn.release();
    }
}

module.exports = { executar, pool }; // exporta a função executar (para os repositórios) e o pool (se precisar em casos especiais)
