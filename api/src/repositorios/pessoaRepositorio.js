// importa a função 'executar' que roda SQL no MySQL usando o pool
const { executar } = require('../banco/conexao');

// objeto que concentra TODAS as operações no banco para a entidade 'Pessoa'
const pessoaRepositorio = {
  // LISTAR: traz todas as pessoas, com filtro opcional por nome/cidade
  async listar(filtro) {
    // se veio um texto de busca (ex.: ?q=maria), aplica LIKE em nome e cidade
    if (filtro) {
      return executar(
        `SELECT * FROM pessoas
         WHERE nome LIKE :q OR cidade LIKE :q
         ORDER BY id DESC`,
        { q: `%${filtro}%` } // monta o parâmetro com curingas para busca parcial
      );
    }
    // sem filtro → lista tudo
    return executar(`SELECT * FROM pessoas ORDER BY id DESC`);
  },

  // BUSCAR POR ID: retorna 1 pessoa pelo id (ou null)
  async buscarPorId(id) {
    const linhas = await executar(
      `SELECT * FROM pessoas WHERE id = :id`,
      { id } // parâmetro nomeado
    );
    // se não encontrar, devolve null; se encontrar, devolve a primeira linha
    return linhas[0] || null;
  },

  // CRIAR: insere e retorna o registro completo criado
  async criar({ nome, cidade, telefone }) {
    // faz o INSERT com parâmetros nomeados para evitar SQL injection
    const resultado = await executar(
      `INSERT INTO pessoas (nome, cidade, telefone)
       VALUES (:nome, :cidade, :telefone)`,
      { nome, cidade, telefone }
    );
    // resultado.insertId tem o id AUTO_INCREMENT gerado
    return this.buscarPorId(resultado.insertId);
  },

  // ATUALIZAR: atualiza pelos campos informados e retorna o registro atualizado
  async atualizar(id, { nome, cidade, telefone }) {
    await executar(
      `UPDATE pessoas
       SET nome = :nome, cidade = :cidade, telefone = :telefone
       WHERE id = :id`,
      { id, nome, cidade, telefone }
    );
    // consulta de novo para devolver a versão atualizada
    return this.buscarPorId(id);
  },

  // REMOVER: apaga pelo id e devolve true/false indicando se algo foi removido
  async remover(id) {
    const r = await executar(
      `DELETE FROM pessoas WHERE id = :id`,
      { id }
    );
    // affectedRows > 0 significa que 1+ linhas foram apagadas
    return r.affectedRows > 0;
  },
};

// exporta o repositório para ser usado pelos controladores (e em testes)
module.exports = { pessoaRepositorio };
