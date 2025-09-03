// src/app.js
const express = require('express');
const cors = require('cors');
const { pessoaRotas } = require('./rotas/pessoaRotas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/pessoas', pessoaRotas);

app.get('/saude', (req, res) => res.json({ ok: true }));

// 🔴 IMPORTANTE: exporta como objeto com a propriedade 'app'
module.exports = { app };
