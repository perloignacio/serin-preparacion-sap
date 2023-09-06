import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Viajes } from 'src/app/models/viajes.model';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  endpoint="";
  constructor(private http: HttpClient) { 
    this.endpoint = environment.apiUrl;

  }
  
  getViajesAbiertos(){
    return this.http.get<Viajes[]>(this.endpoint +'/viajes/abiertos');
  }
}
