import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuarios } from 'src/app/models/usuario.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario:string;
  contra:string;
  constructor(private svcAuthentication:AuthenticationService,private router:Router){

  }

  Ingresar(){
    this.svcAuthentication.login(this.usuario,this.contra).subscribe((u)=>{
      if(u){
          this.router.navigate(['/panel/viajes']);
      }
    },(err)=>{
      Swal.fire("Upps",err.error.Message,'warning');
    })
  }
}
