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
  /***** LISTADOS */
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

  /******** DETALLE UN VIAJE */
  getDetalleViaje(nro:string){
    return this.http.get<Viajes>(this.endpoint +'/viajes/detalle/'+ nro);
  }


  /******* MOVIMIENTOS */
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

/******FIN DE VIAJE */

  setRemito(remito:any){
    return this.http.post<Viajes>(this.endpoint +'/viajes/setRemitos', remito);

  }
  delRemito(remito:any){
    return this.http.post<Viajes>(this.endpoint +'/viajes/delRemitos', remito);

  }


  setFoto(foto:any){
    return this.http.post<Viajes>(this.endpoint +'/movimientos/fotos', foto);
  }
  delFoto(foto:any){
    return this.http.post<Viajes>(this.endpoint +'/movimientos/delFotos', foto);
    
  }

  setCalificacion(viaje:any){
    return this.http.post<Viajes>(this.endpoint +'/movimientos/calificar', viaje);
  
  }

  /******AUXILIARES */
  getMotivos(){
    return this.http.get<Motivos[]>(this.endpoint +'/movimientos/motivos');
  }
}
