import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {
    path: '', component:LoginComponent,
  },
  {
    path: 'login', component:LoginComponent,
  },
  {
    path: 'panel', loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule),canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
