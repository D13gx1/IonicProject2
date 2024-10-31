import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showToast } from 'src/app/tools/message-routines';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';
import { DataBaseService } from './data-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  keyUsuario = 'USUARIO_AUTENTICADO';
  usuarioAutenticado = new BehaviorSubject<Usuario | null>(null);
  primerInicioSesion = new BehaviorSubject<boolean>(false);
  
  // Propiedades para buscar pregunta secreta
  correo: string = ''; // Asegúrate de que sea de tipo string
  usuario?: Usuario; // Hacer que sea opcional

  constructor(private router: Router,
              private bd: DataBaseService, 
              private storage: Storage) { }

  async inicializarAutenticacion() {
    await this.storage.create();
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.leerUsuarioAutenticado().then(usuario => {
      return usuario !== null;
    });
  }

  async leerUsuarioAutenticado(): Promise<Usuario | null> {
    const usuario = await this.storage.get(this.keyUsuario) as Usuario;
    this.usuarioAutenticado.next(usuario);
    return usuario;
  }

  guardarUsuarioAutenticado(usuario: Usuario) {
    this.storage.set(this.keyUsuario, usuario);
    this.usuarioAutenticado.next(usuario);
  }

  eliminarUsuarioAutenticado(usuario: Usuario) {
    this.storage.remove(this.keyUsuario);
    this.usuarioAutenticado.next(null);
  }

  async login(cuenta: string, password: string) {
    await this.storage.get(this.keyUsuario).then(async (usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuarioAutenticado.next(usuarioAutenticado);
        this.primerInicioSesion.next(false);
        this.router.navigate(['/home']);
      } else {
        await this.bd.buscarUsuarioValido(cuenta, password).then(async (usuario: Usuario | undefined) => {
          if (usuario) {
            showToast(`¡Bienvenido(a) ${usuario.nombre} ${usuario.apellido}!`);
            this.guardarUsuarioAutenticado(usuario);
            this.primerInicioSesion.next(true);
            this.router.navigate(['/tabs/codigo-qr']);
          } else {
            showToast(`El correo o la password son incorrectos`);
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  async logout() {
    this.leerUsuarioAutenticado().then((usuario) => {
      if (usuario) {
        showToast(`¡Hasta pronto ${usuario.nombre} ${usuario.apellido}!`);
        this.eliminarUsuarioAutenticado(usuario);
      }
      this.router.navigate(['/login']);
    });
  }

  async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
    return await this.bd.buscarUsuarioPorCorreo(correo); // Cambiado a 'this.bd'
  }

  async buscarPreguntaSecreta(correo: string) { // Ahora recibe el correo como parámetro
    this.correo = correo; // Almacena el correo

    try {
      this.usuario = await this.buscarUsuarioPorCorreo(this.correo); // Llama al método dentro de AuthService
      if (this.usuario) {
        return this.usuario.preguntaSecreta; // Retorna la pregunta secreta
      } else {
        this.presentAlert('Usuario no encontrado', 'El correo ingresado no existe.');
        return '';
      }
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      this.presentAlert('Error', 'No se pudo realizar la búsqueda.');
      return '';
    }
  }
  
  presentAlert(titulo: string, mensaje: string) {
    // Implementación de la alerta
    console.log(`${titulo}: ${mensaje}`); // Placeholder para tu método de alerta
  }
}
