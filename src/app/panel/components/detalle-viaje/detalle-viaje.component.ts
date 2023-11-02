import { DatePipe, Time } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs/internal/observable/interval';
import { environment } from 'src/app/environments/environment';
import { Cargadores } from 'src/app/models/cargadores.model';
import { Motivos } from 'src/app/models/motivos.model';
import { Remitos } from 'src/app/models/remitos.model';
import { Viajes } from 'src/app/models/viajes.model';
import { CargadoresService } from 'src/app/services/cargadores/cargadores.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ViajesService } from 'src/app/services/viajes/viajes.service';
import Swal from 'sweetalert2';
import { Timer } from 'easytimer.js';


@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.component.html',
  styleUrls: ['./detalle-viaje.component.scss']
})
export class DetalleViajeComponent {
  colapseOperarios = false;
  colapseRemitos = false;

  transcurrido:Timer;
  play:boolean=false;
  cliente:Remitos= new Remitos();
  noPlay:boolean = false;
  noStop:boolean = false;


  cargado:boolean = false;
  viaje:string;
  cerrado:boolean = false;
  listCargadores:any[]=[];
  listMotivos:Motivos[]=[];
  listFotos:any[]=[];
  detalleViaje:Viajes = new Viajes();
  cargadoresActivos:Cargadores[]=[];
  currentRate:number =1;
  IdMotivo:number=0;
  fotosURL:string;
  selectedFile:any;
  cronometro:Timer;
  hasfoto:string;
  TextMotivo:string;
  todos:boolean=false;
  subtotal:number=0;
constructor(public time: DatePipe,private nroViaje:ActivatedRoute, private route: Router,private srvViaje:ViajesService, private srvCargadores: CargadoresService,private Modal: NgbModal, public loader:SharedService){
    this.viaje = (this.nroViaje.snapshot.paramMap.get('nroviaje'));
    this.LoadData();
    
}


LoadData(){
  this.loader.cargando = true;
  
  this.srvCargadores.getCargadores().subscribe((c)=> {
    next:{
      this.listCargadores = c;
    }
  })
  
  this.srvViaje.getDetalleViaje(this.viaje).subscribe((dv)=> {
    next:{
      this.detalleViaje = dv;
      this.cronometro=new Timer({ startValues: { seconds: this.detalleViaje.segundos}});
      if(this.detalleViaje.carga?.Estado == 1){
        this.cronometro.start({ startValues: { seconds: this.detalleViaje.segundos}})
        this.play=true;
      }
      if(this.detalleViaje.cargadores.length > 0){
        
        this.getNombres();
        //this.updateTime();
      }
      this.loader.cargando = false;
      this.fotosURL = environment.apiUrl + "fotos/";
      this.getFotos();
    }
   
  })
  

  this.srvViaje.getMotivos().subscribe((m)=> {
    next:{
      this.listMotivos = m;
    }
  })
} 

getFotos(){
  if(this.detalleViaje.carga?.Fotos.length >0){
    this.listFotos= this.detalleViaje.carga.Fotos.split(',');
    console.log(this.listFotos);
    
  }
}
calificar(puntaje:number){
  this.loader.cargando =true;

  let calificacion = {
    "NroViaje":this.detalleViaje.nroviaje,
    "IdControlCargaMovimiento":this.detalleViaje.carga?.IdControlCarga, 
    "calificacion":puntaje+1
  };
  
  this.srvViaje.setCalificacion(calificacion).subscribe((dv)=> {
    next:{
      this.detalleViaje = dv;      
      this.colapseOperarios = true;
      this.loader.cargando =false;

    }
  })
}

cargaRemito(entrega:string){
  this.loader.cargando =true;
  let objRemito = {
    "Entrega":entrega,
    "NroViaje":this.detalleViaje.nroviaje,
  };

  if(entrega == "TODOS"){
    this.detalleViaje.detalle.forEach(element => {
      objRemito.Entrega=element.Entrega;
      this.srvViaje.setRemito(objRemito).subscribe((dv)=> {
        next:{
          this.detalleViaje = dv;
          this.colapseOperarios = true;
          this.loader.cargando =false;
        }
        this.todos=true;
      });
    });
  }else{
    if(!this.remitoCargado(entrega)){
     
      /*** Agregar */
      this.srvViaje.setRemito(objRemito).subscribe((dv)=> {
        next:{
          this.detalleViaje = dv;
          this.colapseOperarios = true;
          this.loader.cargando =false;
    
        }
      })
          }else{
      /*** Borrar */
      this.srvViaje.delRemito(objRemito).subscribe((dv)=> {
        next:{
          this.detalleViaje = dv;
          this.colapseOperarios = true;
           this.loader.cargando =false;
           this.todos=false;
        }
      });
      
    }
  }
}
remitoCargado(entrega:string){

 return this.detalleViaje.remitosCargados?.filter(element => element.Entrega === entrega).length >0; 

}
onFileSelected(event:any) {
  this.selectedFile = event.target.files[0];
  console.log(this.selectedFile);
}
subirFotos(){
  this.loader.cargando =true;
    const form=new FormData();

  let objFoto = {
    "NroViaje":this.detalleViaje.nroviaje,
    "IdControlCargaMovimiento":this.detalleViaje.carga.IdControlCarga
  };
  form.append("objeto",this.loader.convertToJSON(objFoto).objeto);
  form.append('', this.selectedFile);
 // console.log(form);
  
    this.srvViaje.setFoto(form).subscribe((dv)=> {
      next:{
        this.detalleViaje = dv;
        this.getFotos();
        this.colapseOperarios = true;
        this.hasfoto = null;
        this.loader.cargando =false;
  
      }
    })
 }

 
 borrarFoto(foto:string){
   this.loader.cargando =true;
   const form=new FormData();
   


  let objFoto = {
    "NroViaje":this.detalleViaje.nroviaje,
    "IdControlCargaMovimiento":this.detalleViaje.carga.IdControlCarga,
    "Foto":foto
  };
  form.append("objeto",this.loader.convertToJSON(objFoto).objeto);

    this.srvViaje.delFoto(form).subscribe((dv)=> {
      next:{
        this.detalleViaje = dv;
        this.colapseOperarios = true;
        this.getFotos();
        this.loader.cargando =false;
  
      }
    })
}

getNombres(){
  this.detalleViaje.cargadores?.forEach(c => {
   
    this.listCargadores.filter(element =>{
      if(element.Idusuario == c.IdUsuario){        
        this.cargadoresActivos.push(element);
      }
    }
    );
  });

}

getMotivo(id:number){
  this.TextMotivo = null;
  this.detalleViaje.carga?.movimientos.forEach(c => {
   
     this.listMotivos.filter(element =>{
      if(element.IdControlCargaMotivo === id){                
        this.TextMotivo = element.Descripcion;
      }
    }
    );
  }); 
  return this.TextMotivo;
   ;
 }

isCargador(id:number){
 return this.detalleViaje.cargadores?.filter(element => element.IdUsuario === id).length >0; 
}

openModal(motivo:any){
  this.IdMotivo =0;
  this.Modal.open(motivo, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    (result) => {
      this.iniciar();
    },
    (reason) => {
      return 0;
    },
  );
}

openFoto(foto:string,fotoModal:any){
 this.loader.fotoModal = foto;
  this.Modal.open(fotoModal, { ariaLabelledBy: 'modal-basic-title', size: 'lg'  }).result.then(
    (result) => {
      
    }
  );
}

iniciar(){

    const source = interval(1000);
    if(!this.play){
      /**** play */
      if(this.detalleViaje.cargadores.length > 0){ 
          this.loader.cargando =true;
          this.play= true
          
          if(this.detalleViaje.carga != null){
            if(this.detalleViaje.carga.movimientos[this.detalleViaje.carga.movimientos.length -1]?.FechaHasta != null){
              let reanudar: any = {
                "NroViaje":this.detalleViaje.nroviaje,
                "IdControlCarga":this.detalleViaje.carga.movimientos[this.detalleViaje.carga.movimientos.length -1]?.IdControlCarga, 
            };
              
            this.srvViaje.reanudarCarga(reanudar).subscribe((dv)=> {
              next:{
                this.detalleViaje = dv;
                this.colapseOperarios = true;
                this.loader.cargando =false;

                this.cronometro.start({ startValues: { seconds: this.detalleViaje.segundos}})
         
          
              }
            })
            }
          }else{
            
              this.srvViaje.iniciarCarga(this.detalleViaje).subscribe((dv)=> {
                next:{
                  this.detalleViaje = dv;
                  this.colapseOperarios = true;
                  this.loader.cargando =false;

                  this.cronometro.start({ startValues: { seconds: this.detalleViaje.segundos}})
  
  
                }
              });
           
                
            
          }
        }else{
          Swal.fire({
            title: "Atención",
            html:"Debe asignar al menos un operario para la carga",
            icon:'warning',
          });
        }
    }else{
      /*** pausa */
      this.loader.cargando =true;


      let pause: any = {
        "NroViaje":this.detalleViaje.nroviaje,
        "IdControlCargaMovimiento":this.detalleViaje.carga.movimientos[this.detalleViaje.carga.movimientos?.length -1]?.IdControlCargaMovimiento,
        "IdMotivo":0   
      };
       pause.IdMotivo = this.IdMotivo;
      
      if(pause.IdMotivo != 0){
        this.play= false;
        this.srvViaje.PausarCarga(pause).subscribe((dv)=> {
          next:{
            this.detalleViaje = dv;
            this.cronometro.pause();
            this.colapseOperarios = true;
            this.loader.cargando =false;
           


  
          }
        }) 
     }
    }    
  }


detener(){
  let cerrar: any = {
    "NroViaje":this.detalleViaje.nroviaje,
    "IdControlCargaMovimiento":this.detalleViaje.carga.movimientos[this.detalleViaje.carga.movimientos?.length -1]?.IdControlCargaMovimiento
};

  Swal.fire({
    title: "Atención",
    html:"Seguro que desea Finalizar la carga? si continúa no podra reanudar la carga",
    icon:'warning',
    showDenyButton: true,
    confirmButtonText: 'Aceptar',
    denyButtonText: `Cancelar`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.loader.cargando = true

      this.srvViaje.TerminarCarga(cerrar).subscribe((dv)=> {
        next:{
          this.detalleViaje = dv;
          this.colapseOperarios = false;
          this.cerrado =true;
          this.loader.cargando = false;
          this.cronometro.stop();
        }
      })  
    }
  });
  
}
  
   cargarOperario(operario:number){
    let Op: any = {
      "IdUsuario":operario,
      "NroViaje":this.viaje     
  };
  this.loader.cargando=true;
      if(this.isCargador(operario)){
        this.srvCargadores.delCargadores(Op).subscribe((c)=> {
          next:{
            this.detalleViaje =  c;
            this.cargadoresActivos = [];
            this.getNombres();
            if(this.detalleViaje.cargadores.length > 0){
              
            }else{
              this.noPlay=false;
              
            }
            this.loader.cargando=false;
          }
        })
      }else{
        this.srvCargadores.setCargadores(Op).subscribe((c)=> {
          next:{
            this.detalleViaje.cargadores.push(Op);
            
            this.detalleViaje =  c;
            this.cargadoresActivos = [];
            this.getNombres();
            this.loader.cargando=false;
            
          }
        })
      }
      
  }


  calcularTiempo(segundos:number){
    this.transcurrido=new Timer({ startValues: { seconds: segundos}});
    let dias = "";
    if(this.transcurrido.getTimeValues().days > 0){
      dias = this.transcurrido.getTimeValues().days.toLocaleString('es-AR',{minimumIntegerDigits: 2}) + 'días ';
    }
    return dias + this.transcurrido.getTimeValues().hours.toLocaleString('es-AR',{minimumIntegerDigits: 2}) + ':' +this.transcurrido.getTimeValues().minutes.toLocaleString('es-AR',{minimumIntegerDigits: 2}) + ':' +this.transcurrido.getTimeValues().seconds.toLocaleString('es-AR',{minimumIntegerDigits: 2});
  }

  calcularSubtotal(i:number){
    this.subtotal=0;
      for (let index = 0; index <= i; index++) {
        this.subtotal += this.detalleViaje.carga.movimientos[index].segundos
      }
      return this.calcularTiempo(this.subtotal);

  }
  calcularTotal(){
    if(this.detalleViaje.carga.movimientos[this.detalleViaje.carga.movimientos.length-1].FechaHasta){
      var inicio = new Date(this.detalleViaje.carga.movimientos[this.detalleViaje.carga.movimientos.length-1].FechaHasta).getTime();
      var fin    = new Date(this.detalleViaje.carga.movimientos[0].FechaDesde).getTime();
  
      return  this.calcularTiempo((fin - inicio)/1000) 
    }else{
      return 0;
    }
    
  }
}
