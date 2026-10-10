import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Credentials } from '../models/credentials.model';
import { AuthService } from '../services/auth.service';
import { LoginMessages } from './login.messages';

/**
 * Facade de autenticação (Design Pattern: Facade).
 * Esconde do componente a orquestração: chamar API, persistir token e navegar.
 * O componente passa a lidar apenas com estado de UI.
 */
@Injectable({ providedIn: 'root' })
export class AuthFacade {
    constructor(
        private readonly auth: AuthService,
        private readonly router: Router
    ) {}

    /**
     * Executa o fluxo completo de login.
     * Retorna o Observable para o componente tratar estado de loading/erro.
     */
    login(credentials: Credentials): Observable<void> {
        return new Observable<void>((subscriber) => {
            const sub = this.auth
                .login(credentials.email, credentials.password)
                .subscribe({
                    next: () => {
                        this.router.navigate(['/dashboard']);
                        subscriber.next();
                        subscriber.complete();
                    },
                    error: (err) => subscriber.error(err),
                });

            return () => sub.unsubscribe();
        });
    }

    readonly messages = LoginMessages;
}
