import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCategorys(): Observable<any> {
        return this.http.get(`${this.API_URL}/api/category`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
            }
        });
    }

    saveCategory(name: string, color: number): Observable<any> {
        return this.http.post(`${this.API_URL}/api/category`,
            { name: name, colorCategory: color },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`

                }
            }
        );
    }
}
