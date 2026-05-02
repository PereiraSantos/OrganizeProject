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
        return this.http.get(`${this.API_URL}/api/project`);
    }

    saveProjects(name: string, description: string): Observable<any> {
        return this.http.post(`${this.API_URL}/api/project`, {
            name: name, description: description
        });
    }
}
