export function errorMiddleware(err, req, res, next) {
  // logs úteis no dev
  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", err);
  }

  // se já tiver status e mensagem, respeite
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Erro interno";

  // exemplo: erros de validação
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message, details: err.details || undefined });
  }

  // exemplo: erro do multer (upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "Arquivo muito grande" });
  }

  return res.status(status).json({ message });
}
