/**
 * Mensagens da tela de login centralizadas (DRY / OCP).
 * Alterar/adicionar mensagens não exige tocar no componente.
 */
export const LoginMessages = {
    INVALID_CREDENTIALS: 'Usuário ou senha inválidos!',
    REQUIRED_FIELDS: 'Preencha e-mail e senha válidos',
} as const;
