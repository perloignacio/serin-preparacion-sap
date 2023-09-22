import { DatePipe } from '@angular/common';
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


@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.component.html',
  styleUrls: ['./detalle-viaje.component.scss']
})
export class DetalleViajeComponent {
  colapseOperarios = false;
  colapseRemitos = false;

  tiempo:Date;
  transcurrido:number;
  play:boolean=false;
  marca: Date = new Date();
  cliente:Remitos= new Remitos();
  noPlay:boolean = false;
  noStop:boolean = false;

  dias: number = 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
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
      if(this.detalleViaje.carga?.Estado == 1){
        this.iniciar();
        
      }
      if(this.detalleViaje.cargadores.length > 0){
        
        this.getNombres();
        this.updateTime();
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
  if(this.detalleViaje.carga.Fotos.length >0){
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

cargaRemito(remito:string){
  this.loader.cargando =true;

  let objRemito = {
    "Remito":remito,
    "NroViaje":this.detalleViaje.nroviaje,
  };
  if(!this.remitoCargado(remito)){
   
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
      }
    })
  }
}
remitoCargado(remito:string){
 return this.detalleViaje.remitosCargados?.filter(element => element.Remito === remito).length >0; 

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
        this.loader.cargando =false;
  
      }
    })
}

getNombres(){
  this.detalleViaje.cargadores?.forEach(c => {
   
    this.listCargadores.filter(element =>{
    //  console.log(element.Idusuario, c.IdUsuario);
      
      if(element.Idusuario == c.IdUsuario){
        // console.log(element);
        
        this.cargadoresActivos.push(element);
      }
    }
    );
  });

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
          this.loader.cargando =true;
          this.play= true
          if(this.detalleViaje.carga != null){
            this.transcurrido = 0;
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

              }
            })
            }
          }else{
            this.tiempo = new Date();
            this.srvViaje.iniciarCarga(this.detalleViaje).subscribe((dv)=> {
              next:{
                this.detalleViaje = dv;
                this.colapseOperarios = true;
                this.loader.cargando =false;

              }
            })
          }

    }else{
      /*** pausa */
      this.loader.cargando =true;

      console.log(this.detalleViaje);
      let pause: any = {
        "NroViaje":this.detalleViaje.nroviaje,
        "IdControlCargaMovimiento":this.detalleViaje.carga.movimientos[this.detalleViaje.carga.movimientos?.length -1]?.IdControlCargaMovimiento,
        "IdMotivo":0   
    };
       pause.IdMotivo = this.IdMotivo;
      
      if(pause.IdMotivo != 0){
        this.play= false;
        this.tiempo = new Date();    
        this.srvViaje.PausarCarga(pause).subscribe((dv)=> {
          next:{
            this.detalleViaje = dv;
            this.colapseOperarios = true;
            this.loader.cargando =false;

          }
        }) 
     }
    }

    source.subscribe(val => { 
      if(this.play){
        this.updateTime();
      }
    })

    
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
          this.loader.cargando = false

        }
      })  
    }
  });
  
}
getTranscurrido(){
  this.transcurrido=0;
  this.detalleViaje.carga.movimientos?.forEach(element => {
    let hasta = new Date(element.FechaHasta);
    let desde = new Date(element.FechaDesde);
    let comp = new Date(1969,11,31);
    comp.setHours(21,0,0);
  //  console.log( hasta != comp);

    if(hasta.getTime() == comp.getTime()){
      hasta = new Date();
    }
      this.transcurrido += hasta.getTime() - desde.getTime();
    
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

  updateTime() {
    if(this.tiempo == null){
      this.tiempo = new Date();
      this.transcurrido = 0;
    }
    const now = new Date();
    this.getTranscurrido();
    
   // this.marca = new Date(this.tiempo); 
    const diff =  now.getTime() - this.tiempo.getTime() + this.transcurrido;
   // console.log(diff)

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
  //  console.log(this.dias, this.horas , this.minutos, this.segundos);
    
  }
}
