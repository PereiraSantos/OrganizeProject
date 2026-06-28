import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getProjects(): Observable<any> {
        return this.http.get(`${this.API_URL}/api/project`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
            }
        });
    }

    saveProjects(name: string, description: string): Observable<any> {
        return this.http.post(`${this.API_URL}/api/project`, {
            name: name, description: description
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`

                }
            }
        );
    }

    editProject(id: number, name: string, description: string): Observable<any> {
        return this.http.put(`${this.API_URL}/api/project`, {
            id: id,
            name: name,
            description: description
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`

                }
            }
        );
    }
}
