import { Component } from '@angular/core';
import { Viajes } from 'src/app/models/viajes.model';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss']
})

export class ViajesComponent {
  viaje:Viajes = new Viajes();

  constructor(){
    this.viaje.nroviaje = 111;
    this.viaje.viaje= "viaje";
    this.viaje.transporte= "Transporte El transportador";
    this.viaje.codtransporte = 1525;
    this.viaje.clientes = 15;
    this.viaje.peso = 500;
    this.viaje.fecha= "2023/08/23";

  }
}
