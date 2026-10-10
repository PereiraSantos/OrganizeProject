import { Injectable } from '@angular/core';

/**
 * Adaptador/Facade sobre o storage de sessão.
 * Centraliza a chave do token e o acesso ao browser storage (SRP / DIP).
 * Todo o restante do app deve usar este serviço em vez de sessionStorage direto.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
    private readonly TOKEN_KEY = 'auth_token';

    setToken(token: string): void {
        sessionStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    clear(): void {
        sessionStorage.removeItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
