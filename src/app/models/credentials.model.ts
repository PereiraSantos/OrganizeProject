/**
 * Value Object que representa as credenciais de login.
 * Encapsula os dados e o comportamento de validação (POO / coesão).
 */
export class Credentials {
    constructor(
        public email: string = '',
        public password: string = ''
    ) { }

    /**
     * Regra de validação mínima das credenciais.
     */
    isValid(): boolean {
        return this.email.includes('@') && this.password.length >= 4;
    }
}
