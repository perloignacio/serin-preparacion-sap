import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { Usuarios } from 'src/app/models/usuario.model';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<Usuarios>;
  public currentUser: Observable<Usuarios>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<Usuarios>(JSON.parse(localStorage.getItem('currentUserCarga')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuarios {

      return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
      let objpost={usuario:username,clave:password}
      return this.http.post<Usuarios>(`${environment.apiUrl}usuarios/login`,objpost)
          .pipe(map(u => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              if(u){
                localStorage.setItem('currentUserCarga', JSON.stringify(u));
                this.currentUserSubject.next(u);
                return u;
              }else{
                return null;
              }

          }));
  }

  

  logout() {
      // remove user from local storage to log user out

      localStorage.removeItem('currentUserCarga');
      this.currentUserSubject.next(null);
  }
}
