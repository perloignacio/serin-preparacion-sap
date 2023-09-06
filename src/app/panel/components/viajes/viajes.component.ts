import { Component } from '@angular/core';
import { Viajes } from 'src/app/models/viajes.model';
import { ViajesService } from 'src/app/services/viajes/viajes.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss']
})

export class ViajesComponent {
  viajes:Viajes[] = [];
  // viaje:Viajes = new Viajes();
  filtroViajes:Viajes[]=[];
  strFiltro: "";
  constructor(private srvViajes: ViajesService){

this.srvViajes.getViajesAbiertos().subscribe((x)=> {
  next:{
    this.viajes = x;
   this.refreshData();
  }
})
  

}
refreshData(){
  this.filtroViajes=this.viajes;
}

Filtro(){
  this.filtroViajes=this.viajes.filter(obj => {
    const term = this.strFiltro.toLowerCase();
    return obj.viaje.toLowerCase().includes(term) ||  obj.transporte.toLowerCase().includes(term)
  });
}
}
