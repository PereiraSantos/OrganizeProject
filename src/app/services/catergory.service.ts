import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient, private session: SessionService) { }

    private get authHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.session.getToken()}`
        };
    }

    getCategorys(): Observable<any> {
        return this.http.get(`${this.API_URL}/api/category`, {
            headers: this.authHeaders
        });
    }

    saveCategory(name: string, color: number): Observable<any> {
        return this.http.post(`${this.API_URL}/api/category`,
            { name: name, colorCategory: color },
            { headers: this.authHeaders }
        );
    }
}

