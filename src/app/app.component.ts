import { Component, OnInit  } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { InitializeAppService } from './services/initialize.app.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})

export class AppComponent implements OnInit {
  constructor(private initializeAppService: InitializeAppService) {}

  ngOnInit() {
    this.initializeApp();
  }
  
  async initializeApp() {
    await this.initializeAppService.inicializarAplicacion();
  }
}
