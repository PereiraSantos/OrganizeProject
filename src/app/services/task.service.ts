import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private apiUrl = 'http://localhost:3000/api/task';

    constructor(private http: HttpClient) { }

    getTaks(idProject: number): Observable<any> {
        const params = new HttpParams().set('idProject', idProject);
        return this.http.get(this.apiUrl, { params });
    }

    saveTask(name: string, description: string, idCategory: number, idProject: number): Observable<any> {
        return this.http.post(this.apiUrl, {
            name: name, description: description, idCategory: idCategory, idProject: idProject
        });
    }

    updateStatus(id: number, status: number): Observable<any> {
        return this.http.post(this.apiUrl + '/status', {
            id: id, status: status,
        });
    }
}