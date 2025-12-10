import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const key = "auth-user"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = ""; 

  constructor(private http:HttpClient, private router:Router) { }

  login(usuario:Pick<Usuario,'nome'|'senha'>):Observable<Usuario>{
    // 2. ALTERADO: A URL AGORA É '/api/auth/login' para bater com o vercel.json
    return this.http.post<Usuario>(`${this.apiUrl}/api/auth/login`,usuario).pipe(tap(response =>{
      sessionStorage.setItem(key, JSON.stringify(response))
    }));
  }

  logout():void{
    sessionStorage.removeItem(key);
    this.router.navigate(['/login'])
  }

  isLogged():boolean{
    const user = sessionStorage.getItem(key);
    return user ? true:false;
  }
}