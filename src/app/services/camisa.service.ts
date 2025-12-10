import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CamisasService {

  private apiUrl = '/api/camisas';

  constructor(private http: HttpClient) {}

  // Busca tudo
  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}