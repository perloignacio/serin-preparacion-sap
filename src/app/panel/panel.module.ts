import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ViajesComponent } from './components/viajes/viajes.component';
import { MenuComponent } from './shared/menu/menu.component';
import { DetalleViajeComponent } from './components/detalle-viaje/detalle-viaje.component';



@NgModule({
  declarations: [
    HomeComponent,
    ViajesComponent,
    MenuComponent,
    DetalleViajeComponent
  ],
  imports: [
    CommonModule,
    PanelRoutingModule
  ]
})
export class PanelModule { }
