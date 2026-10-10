import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { LoginResponse } from '../models/login-response.model';
import { AuthStrategy } from './auth.strategy';
import { HttpAuthStrategy } from './http-auth.strategy';
import { SessionService } from './session.service';

/**
 * Serviço de autenticação.
 * Responsabilidade única: orquestrar autenticação + persistência da sessão.
 * Delega a chamada concreta para uma AuthStrategy (DIP) e o storage para SessionService.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private readonly strategy: HttpAuthStrategy,
        private readonly session: SessionService
    ) { }

    /**
     * Autentica e persiste o token em caso de sucesso.
     */
    login(email: string, password: string): Observable<LoginResponse> {
        return this.strategy.login(new Credentials(email, password)).pipe(
            tap((response) => this.session.setToken(response.token))
        );
    }

    logout(): void {
        this.session.clear();
    }

    isAuthenticated(): boolean {
        return this.session.isAuthenticated();
    }
}

export type { AuthStrategy };
