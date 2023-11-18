import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Umfrage } from './umfrage.model';
@Injectable({
  providedIn: 'root',
})
export class UmfrageService {
  private apiUrl = 'http://localhost:8080/api/umfrage/all';

  constructor(private http: HttpClient) {}

  getUmfrage(): Observable<Umfrage[]> {
    return this.http.get<Umfrage[]>(this.apiUrl);
  }
 
}
