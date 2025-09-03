const { pessoaRepositorio } = require('../src/repositorios/pessoaRepositorio');

(async () => {
  console.log('--- LISTAR (antes) ---');
  console.log(await pessoaRepositorio.listar());

  console.log('--- CRIAR ---');
  const nova = await pessoaRepositorio.criar({
    nome: 'Maria Teste',
    cidade: 'Campo Mourão',
    telefone: '(44) 90000-0000'
  });
  console.log('Criada:', nova);

  console.log('--- BUSCAR POR ID ---');
  const encontrada = await pessoaRepositorio.buscarPorId(nova.id);
  console.log('Encontrada:', encontrada);

  console.log('--- ATUALIZAR ---');
  const atualizada = await pessoaRepositorio.atualizar(nova.id, {
    nome: 'Maria T. Atualizada',
    cidade: 'Maringá',
    telefone: '(44) 98888-7777'
  });
  console.log('Atualizada:', atualizada);

  console.log('--- REMOVER ---');
  const ok = await pessoaRepositorio.remover(nova.id);
  console.log('Removido?', ok);

  console.log('--- LISTAR (depois) ---');
  console.log(await pessoaRepositorio.listar());
})();
