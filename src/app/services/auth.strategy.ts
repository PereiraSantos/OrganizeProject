import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { LoginResponse } from '../models/login-response.model';

/**
 * Contrato para estratégias de autenticação (Design Pattern: Strategy).
 * Permite trocar a implementação (HTTP, OAuth, mock para testes)
 * sem alterar quem consome (OCP / DIP / ISP).
 */
export interface AuthStrategy {
    login(credentials: Credentials): Observable<LoginResponse>;
}
