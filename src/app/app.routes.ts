import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { TutorialComponent } from './pages/tutorial/tutorial.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LandingComponent } from './pages/landing/landing.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';

export const routes: Routes = [
    {path:'login',component:LoginComponent},
    {path:'landing',component:LandingComponent},
    {path:'cadastro',component:CadastroComponent},
    {path:'home', component:HomeComponent,canActivate:[authGuard]},
    {path:'tutorial', component:TutorialComponent, canActivate:[authGuard]},
    {path:'pedido', component:PedidoComponent, canActivate:[authGuard]},
    {path:'dashboard', component:DashboardComponent, canActivate:[authGuard]},
    {path:'',redirectTo:'landing',pathMatch:"full"}
];
