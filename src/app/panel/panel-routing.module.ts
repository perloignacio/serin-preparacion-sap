import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ViajesComponent } from './components/viajes/viajes.component';
import { DetalleViajeComponent } from './components/detalle-viaje/detalle-viaje.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[
      {
        path: 'viajes/:estado',
        component: ViajesComponent,
      },
      {
        path: 'viajes',
        redirectTo: 'viajes/abiertos', 
        pathMatch: 'full' 
        
      },
      {
        path: 'detalle/:nroviaje',
        component: DetalleViajeComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
