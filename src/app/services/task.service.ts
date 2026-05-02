import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getTaks(idProject: number): Observable<any> {
        const params = new HttpParams().set('idProject', idProject);
        return this.http.get(`${this.API_URL}/api/task`, { params });
    }

    saveTask(name: string, description: string, idCategory: number, idProject: number): Observable<any> {
        return this.http.post(`${this.API_URL}/api/task`, {
            name: name, description: description, idCategory: idCategory, idProject: idProject
        });
    }

    updateStatus(id: number, status: number): Observable<any> {
        return this.http.post(`${this.API_URL}/api/task` + '/status', {
            id: id, status: status,
        });
    }
}