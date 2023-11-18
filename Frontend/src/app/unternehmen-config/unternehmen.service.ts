import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unternehmen } from './unternehmen.model';
@Injectable({
  providedIn: 'root',
})
export class UnternehmenService {
  private apiUrl = 'http://localhost:8080/api/unternehmen/all';

  constructor(private http: HttpClient) {}

  getUnternehmen(): Observable<Unternehmen[]> {
    return this.http.get<Unternehmen[]>(this.apiUrl);
  }
 
}
