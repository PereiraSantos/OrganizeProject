import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Credentials } from '../models/credentials.model';
import { LoginResponse } from '../models/login-response.model';
import { AuthStrategy } from './auth.strategy';

/**
 * Implementação HTTP da estratégia de autenticação (Strategy concreta).
 */
@Injectable({ providedIn: 'root' })
export class HttpAuthStrategy implements AuthStrategy {
    private readonly API_URL = environment.apiUrl;

    constructor(private readonly http: HttpClient) {}

    login(credentials: Credentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/api/user/auth`, {
            email: credentials.email,
            password: credentials.password,
        });
    }
}
