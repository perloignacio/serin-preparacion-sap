import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Cargadores } from 'src/app/models/cargadores.model';
import { Viajes } from 'src/app/models/viajes.model';

@Injectable({
  providedIn: 'root'
})
export class CargadoresService {
  endpoint="";
  constructor(private http: HttpClient) { 
    this.endpoint = environment.apiUrl;

  }
  
  getCargadores(){
    return this.http.get<Cargadores[]>(this.endpoint +'/viajes/cargadores');
  }
  setCargadores(operador:any){
    return this.http.post<Viajes>(this.endpoint +'/viajes/setCargadores', operador );
  }
  delCargadores(operador:any){
    
    return this.http.post<Viajes>(this.endpoint +'/viajes/delCargadores', operador);
  }
}
