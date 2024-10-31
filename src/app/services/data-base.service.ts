import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject } from 'rxjs';
import { NivelEducacional } from '../model/nivel-educacional';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  userUpgrades = [
    {
      toVersion: 1,
      statements: [`CREATE TABLE IF NOT EXISTS USUARIO (
        cuenta TEXT PRIMARY KEY NOT NULL,
        correo TEXT NOT NULL,
        password TEXT NOT NULL,
        preguntaSecreta TEXT NOT NULL,
        respuestaSecreta TEXT NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        nivelEducacional INTEGER NOT NULL,
        fechaNacimiento INTEGER NOT NULL
      );`]
    }
  ];

  sqlInsertUpdate = `INSERT OR REPLACE INTO USUARIO (
    cuenta, 
    correo, 
    password, 
    preguntaSecreta, 
    respuestaSecreta,
    nombre, 
    apellido,
    nivelEducacional, 
    fechaNacimiento
  ) VALUES (?,?,?,?,?,?,?,?,?);`;

  nombreBD = 'basedatos';
  db!: SQLiteDBConnection;
  listaUsuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  datosQR: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private sqliteService: SQLiteService) {
    this.inicializarBaseDeDatos(); // Inicializa la base de datos y crea usuarios de prueba
  }

  async inicializarBaseDeDatos() {
    await this.sqliteService.crearBaseDeDatos(this.nombreBD, false); // Ajusta la llamada
    this.db = await this.sqliteService.abrirBaseDeDatos(this.nombreBD, false, 'no-encryption', 1, false);
    await this.crearUsuariosDePrueba();  // Asegúrate de que esto se ejecute
    await this.leerUsuarios();  // Verifica que los usuarios se lean correctamente
    const usuarios: Usuario[] = this.listaUsuarios.getValue();  // Obtiene la lista de usuarios
    console.log('Usuarios en la base de datos:', usuarios);  // Inspecciona la lista
}


  async crearUsuariosDePrueba() {

    await this.guardarUsuario(Usuario.getNewUsuario(
      'testuser',
      'testuser@example.com',
      'password',
      '¿Cuál es tu animal favorito?',
      'perro',
      'Test',
      'User',
      NivelEducacional.buscarNivelEducacional(5)!,
      new Date(2000, 0, 1)
  ));
  
    await this.guardarUsuario(Usuario.getNewUsuario(
      'atorres',
      'atorres@duocuc.cl',
      '1234',
      '¿Cuál es tu animal favorito?',
      'gato',
      'Ana',
      'Torres',
      NivelEducacional.buscarNivelEducacional(6)!,
      new Date(2000, 0, 5)));

    await this.guardarUsuario(Usuario.getNewUsuario(
      'jperez',
      'jperez@duocuc.cl',
      '5678',
      '¿Cuál es tu postre favorito?',
      'panqueques',
      'Juan',
      'Pérez',
      NivelEducacional.buscarNivelEducacional(5)!,
      new Date(2000, 1, 10)));

    await this.guardarUsuario(Usuario.getNewUsuario(
      'cmujica',
      'cmujica@duocuc.cl',
      '0987',
      '¿Cuál es tu vehículo favorito?',
      'moto',
      'Carla',
      'Mujica',
      NivelEducacional.buscarNivelEducacional(6)!,
      new Date(2000, 2, 20)));
  }

  async guardarUsuario(usuario: Usuario): Promise<void> {
    await this.db.run(this.sqlInsertUpdate, [usuario.cuenta, usuario.correo, usuario.password,
        usuario.preguntaSecreta, usuario.respuestaSecreta, usuario.nombre, usuario.apellido,
        usuario.nivelEducacional.id, usuario.fechaNacimiento?.getTime()]);
    console.log(`Usuario guardado: ${usuario.nombre} ${usuario.apellido}`);
    await this.leerUsuarios();
  }

  async leerUsuarios(): Promise<void> {
    const usuarios: Usuario[] = (await this.db.query('SELECT * FROM USUARIO;')).values as Usuario[];
    this.listaUsuarios.next(usuarios);
  }

  async leerUsuario(cuenta: string): Promise<Usuario | undefined> {
    const usuarios: Usuario[] = (await this.db.query(
      'SELECT * FROM USUARIO WHERE cuenta=?;',
      [cuenta])).values as Usuario[];
    return usuarios[0];
  }

  async eliminarUsuarioUsandoCuenta(cuenta: string): Promise<void> {
    await this.db.run('DELETE FROM USUARIO WHERE cuenta=?',
      [cuenta]);
    await this.leerUsuarios();
  }

  async buscarUsuarioValido(cuenta: string, password: string): Promise<Usuario | undefined> {
    const usuarios: Usuario[] = (await this.db.query(
      'SELECT * FROM USUARIO WHERE cuenta=? AND password=?;',
      [cuenta, password])).values as Usuario[];
    return usuarios[0];
  }

  async buscarUsuarioPorCuenta(cuenta: string): Promise<Usuario | undefined> {
    const usuarios: Usuario[] = (await this.db.query(
      'SELECT * FROM USUARIO WHERE cuenta=?;',
      [cuenta])).values as Usuario[];
    return usuarios[0];
  }

  // Método nuevo para buscar por correo
  async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
    console.log('Buscando usuario con correo:', correo); // Inspecciona el correo que buscas
    try {
        const result = await this.db.query('SELECT * FROM USUARIO WHERE correo=?;', [correo]);
        const usuarios: Usuario[] = result.values as Usuario[];

        if (usuarios.length > 0) {
            console.log(`Usuario encontrado: ${usuarios[0].nombre} ${usuarios[0].apellido}`);
            return usuarios[0];
        } else {
            console.log('No se encontró ningún usuario con ese correo.');
            return undefined;
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        return undefined;
    }
}

}
