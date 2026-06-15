const DEMO_EMAILS = {
    familia: 'ana.santos@cuidarmais.com',
    gestor: 'roberto.almeida@cuidarmais.com',
    admin: 'admin@cuidarmais.com'
}

const LEGACY_DEMO_EMAILS = {
    familia: 'familia.demo@cuidarmais.com',
    gestor: 'gestor.demo@cuidarmais.com',
    admin: 'admin.demo@cuidarmais.com'
}

const READ_ONLY_ADMIN_EMAILS = [
    DEMO_EMAILS.admin,
    LEGACY_DEMO_EMAILS.admin
]

const DEMO_PASSWORD = 'CuidarMais@2026'

module.exports = {
    DEMO_EMAILS,
    LEGACY_DEMO_EMAILS,
    READ_ONLY_ADMIN_EMAILS,
    DEMO_PASSWORD
}
