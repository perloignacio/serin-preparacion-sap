import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ViajesComponent } from './components/viajes/viajes.component';
import { MenuComponent } from './shared/menu/menu.component';
import { DetalleViajeComponent } from './components/detalle-viaje/detalle-viaje.component';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [
    HomeComponent,
    ViajesComponent,
    MenuComponent,
    DetalleViajeComponent,

  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    FormsModule,
    NgbCollapseModule,
    NgbRatingModule,
    NgbTooltipModule 
  ]
})
export class PanelModule { }
