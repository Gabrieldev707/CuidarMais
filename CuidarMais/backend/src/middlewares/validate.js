const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.issues.map((e) => ({
            campo: e.path.join('.'),
            mensagem: e.message,
        }));
        return res.status(400).json({ erro: 'Dados inválidos', detalhes: errors });
    }

    req.body = result.data; // dados limpos e validados
    next();
};

module.exports = validate;