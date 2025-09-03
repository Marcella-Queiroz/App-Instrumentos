// importa a app Express já configurada
const { app } = require('./app');

// importa a porta definida no .env (via ambiente.js)
const { porta } = require('./configuracoes/ambiente');

// inicia o servidor HTTP escutando na porta informada
app.listen(porta, () => {
  console.log(`🎶 Servidor TuneTrade rodando em http://localhost:${porta}`);
});
