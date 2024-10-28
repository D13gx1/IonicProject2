import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonText, IonButton, IonLabel, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';  
import { Router } from '@angular/router';  
import { Usuario } from '../../model/usuario';  

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonLabel, IonButton, IonText, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RecuperarPage implements OnInit {

  cuenta: string = '';  
  preguntaSecreta: string = '';  
  respuestaSecreta: string = '';  
  usuario: Usuario | undefined;  

  constructor(
    private alertController: AlertController,
    private router: Router  
  ) { }

  ngOnInit() {
    console.log('Componente inicializado');
    // Aquí puedes agregar cualquier lógica de inicialización si la necesitas.
  }
  

  buscarPreguntaSecreta() {
    this.usuario = Usuario.getListaUsuarios().find(usu => usu.cuenta === this.cuenta);

    if (this.usuario) {
      this.preguntaSecreta = this.usuario.preguntaSecreta;
    } else {
      this.preguntaSecreta = '';
      this.presentAlert('Usuario no encontrado', 'La cuenta ingresada no existe.');
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
    this.cuenta = '';
    this.preguntaSecreta = '';
    this.respuestaSecreta = '';
    this.usuario = undefined;
  }
}

