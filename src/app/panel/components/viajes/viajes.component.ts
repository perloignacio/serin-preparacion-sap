import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cargadores } from 'src/app/models/cargadores.model';
import { Viajes } from 'src/app/models/viajes.model';
import { CargadoresService } from 'src/app/services/cargadores/cargadores.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ViajesService } from 'src/app/services/viajes/viajes.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.scss']
})

export class ViajesComponent implements OnInit{

  estado: string = 'activos';


  viajes:Viajes[] = [];
  // viaje:Viajes = new Viajes();
  filtroViajes:Viajes[]=[];
  strFiltro: "";
  cargando:boolean=true;
  listCargadores:any[]=[];
  cargadoresActivos:Cargadores[]=[];
  allCargadores:any[]=[];


  constructor(private srvViajes: ViajesService, private srvCargadores:CargadoresService,private est:ActivatedRoute, private loader:SharedService,private router:Router){
    

}

ngOnInit() {
  this.est.params.subscribe(routeParams => {
    this.estado=(routeParams['estado']);
    this.loadData();
  });
  
}
loadData(){

  this.srvCargadores.getCargadores().subscribe((c)=> {
    next:{
      this.listCargadores = c;   
    }
  })

  switch (this.estado) {
    case 'abiertos':
      this.loader.cargando=true;
      this.srvViajes.getViajesAbiertos().subscribe((x)=> {
        next:{
          this.viajes = x;
         this.refreshData();
        }
      })
      break;
      
      case 'iniciados':
        this.loader.cargando=true;
        this.srvViajes.getViajesIniciados().subscribe((x)=> {
          next:{
            this.viajes = x;
           this.refreshData();
          }
        })
        break;
        case 'pausados':
      this.loader.cargando=true;

          this.srvViajes.getViajesPausados().subscribe((x)=> {
            next:{
              this.viajes = x;
             this.refreshData();
            }
          })
          break;
          case 'terminados':
      this.loader.cargando=true;

            this.srvViajes.getViajesTerminados().subscribe((x)=> {
              next:{
                this.viajes = x;
               this.refreshData();
              }
            })
            break;
    default:
      this.loader.cargando=true;

      this.srvViajes.getViajesAbiertos().subscribe((x)=> {
        next:{
          this.viajes = x;
         this.refreshData();
        }
      })
      break;
  }

}

detalle(nroviaje:number){
  this.router.navigate(["panel/detalle/",nroviaje]);
  
}
refreshData(){
  this.filtroViajes=this.viajes;
  this.loader.cargando = false;
  this.getNombres();
}

Filtro(){
  this.loader.cargando=true;
  this.filtroViajes=this.viajes.filter(obj => {
    const term = this.strFiltro.toLowerCase();
    this.loader.cargando=false;
    return obj.viaje.toLowerCase().includes(term) ||  obj.transporte.toLowerCase().includes(term)
  });
}

getNombres(){


  this.filtroViajes.forEach(fv => {
   
    fv.cargadores.forEach(c => {
      
      this.listCargadores.filter(element =>{
       // console.log(element.IdUsuario, c.IdUsuario);
        
        if(element.Idusuario == c.IdUsuario){
         //  console.log(element);

          this.cargadoresActivos.push(element);
        }
      }
      );
    });
    this.allCargadores.push(this.cargadoresActivos);
   // console.log(this.allCargadores);

    this.cargadoresActivos=[];
  
  });
  

}

}


function ngOnInit() {
  throw new Error('Function not implemented.');
}

