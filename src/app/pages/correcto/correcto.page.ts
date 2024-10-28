import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonCardContent, IonCard, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [IonButton, IonCard, IonCardContent, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CorrectoPage implements OnInit {

  password: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    // Obtener el estado de la navegación para recuperar la contraseña
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && nav.extras.state) {
      this.password = nav.extras.state['password'];  // Recuperar la contraseña pasada desde la página de recuperar
    } else {
      console.error('No se recibió la contraseña en la página correcto.');
    }
  }

}