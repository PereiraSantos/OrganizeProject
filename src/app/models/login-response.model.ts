/**
 * Contrato de resposta da autenticação.
 * Tipagem forte evita quebras silenciosas (LSP / type-safety).
 */
export interface LoginResponse {
    token: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}
