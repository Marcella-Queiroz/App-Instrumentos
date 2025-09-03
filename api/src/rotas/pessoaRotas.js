// src/rotas/pessoaRotas.js
const { Router } = require('express');
const { pessoaControlador } = require('../controladores/pessoaControlador');

const rotas = Router();

rotas.get('/',     pessoaControlador.listar);
rotas.get('/:id',  pessoaControlador.buscar);
rotas.post('/',    pessoaControlador.criar);
rotas.put('/:id',  pessoaControlador.atualizar);
rotas.delete('/:id', pessoaControlador.remover);

module.exports = { pessoaRotas: rotas };  // 🔴 exporta como objeto
