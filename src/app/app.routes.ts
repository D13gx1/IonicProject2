import { Routes } from '@angular/router';
import { ingresoGuard } from './guards/ingreso-guard.service';
import { inicioGuard } from './guards/inicio-guard.service';
import { TabsPage } from './tabs/tabs.page'; // Asegúrate de que la ruta sea correcta

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [ingresoGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [inicioGuard]
  },
  {
    path: 'theme',
    loadComponent: () => import('./pages/theme/theme.page').then(m => m.ThemePage)
  },
  {
    path: 'tabs',
    component: TabsPage, // Carga el componente de la página de Tabs
    children: [
      {
        path: 'codigo-qr',
        loadComponent: () => import('./tabs/codigo-qr/codigo-qr.page').then(m => m.CodigoQrPage)
      },
      {
        path: 'inicio',
        loadComponent: () => import('./tabs/foro/foro.page').then(m => m.InicioPage)
      },
      {
        path: 'mi-curso',
        loadComponent: () => import('./tabs/mi-curso/mi-curso.page').then(m => m.MiCursoPage)
      },
      {
        path: 'mi-info',
        loadComponent: () => import('./tabs/mi-info/mi-info.page').then(m => m.MiInfoPage)
      }
    ]
  },
  {
    path: 'ruta',
    loadComponent: () => import('./pages/ruta/ruta.page').then(m => m.RutaPage)
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./pages/recuperar/recuperar.page').then( m => m.RecuperarPage)
  },
  {
    path: 'correcto',
    loadComponent: () => import('./pages/correcto/correcto.page').then( m => m.CorrectoPage)
  },
  {
    path: 'incorrecto',
    loadComponent: () => import('./pages/incorrecto/incorrecto.page').then( m => m.IncorrectoPage)
  }

];
