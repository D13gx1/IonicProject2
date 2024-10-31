import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { DataBaseService } from './data-base.service';

@Injectable({
  providedIn: 'root'
})
export class InitializeAppService {
  isAppInit: boolean = false;
  platform!: string;

  constructor(
    private sqliteService: SQLiteService,
    private storageService: DataBaseService,
    private authService: AuthService) { }

    async inicializarAplicacion() {
      await this.sqliteService.inicializarPlugin().then(async (ret) => {
        console.log("Plugin SQLite inicializado correctamente");
        this.platform = this.sqliteService.platform;
        try {
          if (this.sqliteService.platform === 'web') {
            await this.sqliteService.inicializarAlmacenamientoWeb();
          }
          await this.storageService.inicializarBaseDeDatos();
          this.authService.inicializarAutenticacion();
          this.isAppInit = true;
        } catch (error) {
          console.error(`Error durante la inicialización de la aplicación: ${error}`);
        }
      }).catch(err => {
        console.error(`Error al inicializar el plugin SQLite: ${err}`);
      });
    }

}
