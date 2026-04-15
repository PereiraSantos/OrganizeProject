import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private apiUrl = 'http://localhost:3010/api/project';

    constructor(private http: HttpClient) { }

    getProjects(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    saveProjects(name: string, description: string): Observable<any> {
        return this.http.post(this.apiUrl, {
            name: name, description: description
        });
    }
}
