import { Routes } from '@angular/router';
import { ingresoGuard } from './guards/ingreso-guard.service';
import { inicioGuard } from './guards/inicio-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [ingresoGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [inicioGuard]
  },
  {
    path: 'theme',
    loadComponent: () => import('./pages/theme/theme.page').then( m => m.ThemePage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    path: 'codigo-qr',
    loadComponent: () => import('./tabs/codigo-qr/codigo-qr.page').then( m => m.CodigoQrPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./tabs/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'mi-curso',
    loadComponent: () => import('./tabs/mi-curso/mi-curso.page').then( m => m.MiCursoPage)
  },
  {
    path: 'mi-info',
    loadComponent: () => import('./tabs/mi-info/mi-info.page').then( m => m.MiInfoPage)
  },
  {
    path: 'codigo-qr',
    loadComponent: () => import('./tabs/codigo-qr/codigo-qr.page').then( m => m.CodigoQrPage)
  },
];
