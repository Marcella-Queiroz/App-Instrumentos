require('dotenv').config();

module.exports = {
  porta: Number(process.env.PORTA) || 3001,
  banco: {
    host: process.env.DB_HOST || '127.0.0.1',
    porta: Number(process.env.DB_PORT) || 3306,
    usuario: process.env.DB_USUARIO || 'root',
    senha: process.env.DB_SENHA || '',
    nome: process.env.DB_NOME || 'tunetrade',
  },
};

