import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonText, IonButton, IonLabel, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';  
import { Router } from '@angular/router';  
import { Usuario } from '../../model/usuario';  
import { DataBaseService } from '../../services/data-base.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonLabel, IonButton, IonText, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RecuperarPage implements OnInit {

  correo: string = '';  
  preguntaSecreta: string = '';  
  respuestaSecreta: string = '';  
  usuario: Usuario | undefined;  

  constructor(
    private alertController: AlertController,
    private router: Router,
    private dbService: DataBaseService
  ) { }

  ngOnInit() {
    console.log('Componente inicializado');
    // Aquí puedes agregar cualquier lógica de inicialización si la necesitas.
  }
  

  async buscarPreguntaSecreta() {
    try {
      this.usuario = await this.dbService.buscarUsuarioPorCuenta(this.correo);
      if (this.usuario) {
        this.preguntaSecreta = this.usuario.preguntaSecreta;
      } else {
        this.preguntaSecreta = '';
        this.presentAlert('Usuario no encontrado', 'El correo ingresado no existe.');
      }
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      this.presentAlert('Error', 'No se pudo realizar la búsqueda.');
    }
  }
  

  verificarRespuestaSecreta() {
    if (!this.respuestaSecreta) {
      this.presentAlert('Error', 'Por favor, ingresa tu respuesta secreta.');
      return;
    }
  
    if (this.usuario && this.respuestaSecreta === this.usuario.respuestaSecreta) {
      this.router.navigate(['/correcto'], {
        state: { password: this.usuario.password }
      });
    } else {
      this.router.navigate(['/incorrecto']);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ionViewWillLeave() {
    this.correo = '';
    this.preguntaSecreta = '';
    this.respuestaSecreta = '';
    this.usuario = undefined;
  }
}

