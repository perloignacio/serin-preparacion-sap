import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Motivos } from 'src/app/models/motivos.model';
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
  getViajesIniciados(){
    return this.http.get<Viajes[]>(this.endpoint +'/viajes/iniciados');
  }
  getViajesPausados(){
    return this.http.get<Viajes[]>(this.endpoint +'/viajes/pausados');
  }
  getViajesTerminados(){
    return this.http.get<Viajes[]>(this.endpoint +'/viajes/Terminados');
  }

  getDetalleViaje(nro:string){
    return this.http.get<Viajes>(this.endpoint +'/viajes/detalle/'+ nro);
  }

  iniciarCarga(Viaje:Viajes){
    return this.http.post<Viajes>(this.endpoint +'/movimientos/iniciar', Viaje);
  }
  
  reanudarCarga(Viaje:Viajes){
    return this.http.post<Viajes>(this.endpoint +'/movimientos/iniciar', Viaje);
  }
  PausarCarga(Viaje:Viajes){
    return this.http.post<Viajes>(this.endpoint +'/movimientos/pausar', Viaje);
  }
  TerminarCarga(Viaje:Viajes){
    return this.http.post<Viajes>(this.endpoint +'/movimientos/Terminar', Viaje);
  }

  getMotivos(){
    return this.http.get<Motivos[]>(this.endpoint +'/movimientos/motivos');
  }
}
