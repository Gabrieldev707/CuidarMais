const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errors = result.error.issues.map((e) => ({
            campo: e.path.join('.'),
            mensagem: e.message,
        }));
        const primeiraMensagem = errors[0]?.mensagem || 'Dados invalidos';

        return res.status(400).json({
            message: primeiraMensagem,
            erro: 'Dados invalidos',
            detalhes: errors
        });
    }

    req.body = result.data;
    next();
};

module.exports = validate;
