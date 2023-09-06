import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs/internal/observable/interval';
import { Remitos } from 'src/app/models/remitos.model';
import { Tiempo } from 'src/app/models/tiempo.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.component.html',
  styleUrls: ['./detalle-viaje.component.scss']
})
export class DetalleViajeComponent {
  colapseOperarios = false;
  colapseRemitos = false;
  
tiempo:Date;
play:boolean=false;
marca: Date = new Date();
cliente:Remitos= new Remitos();

  dias: number = 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  cargado:boolean = false;
  viaje:string;
  cerrado:boolean = false;

constructor(public time: DatePipe,private nroViaje:ActivatedRoute, private route: Router){
  this.viaje = (this.nroViaje.snapshot.paramMap.get('nroviaje'));
}
  iniciar(){
    const source = interval(1000);

    if(!this.play){
      Swal.fire({
        title: "Atención",
        text:"Si inicia el conteo, no podrá modificar los operarios de carga, esta seguro que desea continuar?",
        icon:'warning',
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.cerrado = true;
          this.colapseOperarios = true;
          error: ()=>{
            }
        }
      });



      /**** play */
      this.play= true
      this.tiempo = new Date();
    }else{
      /*** pausa */
      this.play= false;
      this.tiempo = new Date();      
    }

    source.subscribe(val => { 
      if(this.play){
        this.updateTime();
      }
    })

    
  }

  checkTime(remito:number){
    Swal.fire({
      title: "Atención",
      text:"Confirma que este remito ya fue cargado?",
      icon:'warning',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.cargado = true;
        
        error: ()=>{
          }
      }
    });
  }


  updateTime() {
    if(this.tiempo == null){

    }
    const now = new Date();
   // this.marca = new Date(this.tiempo); 
    const diff =  now.getTime() - this.tiempo.getTime();
    console.log(diff)

    // Cálculos para sacar lo que resta hasta ese tiempo objetivo / final
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    const secs = Math.floor(diff / 1000);
    
    // La diferencia que se asignará para mostrarlo en la pantalla
     this.dias = dias;
     this.horas = horas - dias * 24;
     this.minutos = mins - horas * 60;
     this.segundos = secs - mins * 60;
    console.log(this.dias, this.horas , this.minutos, this.segundos);
    
  }
}
