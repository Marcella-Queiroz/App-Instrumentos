// importa as funções do repositório que fala direto com o MySQL
const { pessoaRepositorio } = require('../repositorios/pessoaRepositorio');

// objeto com os "handlers" (funções) que respondem às requisições HTTP
const pessoaControlador = {
  // GET /pessoas?q=texto  → lista pessoas; se q vier, aplica busca por nome/cidade
  async listar(req, res) {
    try {
      const filtro = req.query.q || null;        // pega ?q= da URL (opcional)
      const dados = await pessoaRepositorio.listar(filtro); // chama o repositório
      return res.json(dados);                     // devolve a lista como JSON
    } catch (e) {
      console.error('Erro ao listar pessoas:', e.message);
      return res.status(500).json({ erro: 'Falha ao listar pessoas' }); // erro genérico
    }
  },

  // GET /pessoas/:id  → busca 1 pessoa pelo id
  async buscar(req, res) {
    try {
      const id = Number(req.params.id);          // pega :id da rota e converte pra número
      if (Number.isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' }); // validação simples
      }
      const pessoa = await pessoaRepositorio.buscarPorId(id); // consulta no banco
      if (!pessoa) return res.status(404).json({ erro: 'Pessoa não encontrada' }); // 404 se não existe
      return res.json(pessoa);                   // devolve o registro
    } catch (e) {
      console.error('Erro ao buscar pessoa:', e.message);
      return res.status(500).json({ erro: 'Falha ao buscar pessoa' });
    }
  },

  // POST /pessoas  → cria nova pessoa
  async criar(req, res) {
    try {
      const { nome, cidade, telefone } = req.body; // pega dados do corpo da requisição

      // validações mínimas (obrigatoriedade)
      if (!nome || !cidade || !telefone) {
        return res.status(400).json({ erro: 'Campos obrigatórios: nome, cidade, telefone' });
      }

      // cria no banco via repositório; retorna o registro completo com id
      const nova = await pessoaRepositorio.criar({ nome, cidade, telefone });
      return res.status(201).json(nova);        // 201 = criado com sucesso
    } catch (e) {
      console.error('Erro ao criar pessoa:', e.message);
      return res.status(500).json({ erro: 'Falha ao criar pessoa' });
    }
  },

  // PUT /pessoas/:id  → atualiza pessoa existente
  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);         // id vindo da URL
      if (Number.isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' });
      }

      const { nome, cidade, telefone } = req.body; // campos para atualizar
      if (!nome || !cidade || !telefone) {
        return res.status(400).json({ erro: 'Campos obrigatórios: nome, cidade, telefone' });
      }

      // garante que existe antes de atualizar
      const existe = await pessoaRepositorio.buscarPorId(id);
      if (!existe) return res.status(404).json({ erro: 'Pessoa não encontrada' });

      // faz a atualização e devolve o registro atualizado
      const atualizada = await pessoaRepositorio.atualizar(id, { nome, cidade, telefone });
      return res.json(atualizada);
    } catch (e) {
      console.error('Erro ao atualizar pessoa:', e.message);
      return res.status(500).json({ erro: 'Falha ao atualizar pessoa' });
    }
  },

  // DELETE /pessoas/:id  → remove pessoa
  async remover(req, res) {
    try {
      const id = Number(req.params.id);         // id vindo da URL
      if (Number.isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' });
      }

      const ok = await pessoaRepositorio.remover(id); // tenta remover no banco
      if (!ok) return res.status(404).json({ erro: 'Pessoa não encontrada' }); // nada removido → 404

      return res.status(204).send();            // 204 = sucesso sem corpo de resposta
    } catch (e) {
      console.error('Erro ao remover pessoa:', e.message);
      return res.status(500).json({ erro: 'Falha ao remover pessoa' });
    }
  },
};

// exporta o controlador para ser usado nas rotas
module.exports = { pessoaControlador };
