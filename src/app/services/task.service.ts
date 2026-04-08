import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private apiUrl = 'http://localhost:3000/api/task';

    constructor(private http: HttpClient) { }

    getTaks(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    saveTask(name: string, description: string, idCategory: number): Observable<any> {
        return this.http.post(this.apiUrl, {
            name: name, description: description, idCategory: idCategory
        });
    }

    updateStatus(id: number, status: number): Observable<any> {
        return this.http.post(this.apiUrl + '/status', {
            id: id, status: status,
        });
    }
}