import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabButton, IonIcon, IonLabel, IonTabBar, IonTabs } from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component'; // Asegúrate de que la ruta sea correcta
import { Usuario } from '../model/usuario'; // Ajusta la ruta según sea necesario
import { DataBaseService } from '../services/data-base.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonLabel, IonIcon, IonTabButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent]
})
export class TabsPage implements OnInit {
  usuario: any;  //BORRAR ESTE CODIGO DESPUES .SOLO MOMENTANEO PARA QUE NO SE CAIGA LA PAGINA

  constructor(private router: Router, private db: DataBaseService) { }


  ngOnInit() {
  }

  irAMiInfo(){
    this.usuario?.navegarEnviandousuario(this.router,"/tabs/mi-info")
  }
}
