import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { 
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLitePlugin,
  capSQLiteUpgradeOptions
} from '@capacitor-community/sqlite';

interface UpgradeStatement {
  statements: string; // Puedes ajustar esto según tus necesidades
}

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  sqliteConnection!: SQLiteConnection;
  isService: boolean = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native: boolean = false;
  userUpgrades: UpgradeStatement[] = []; // Inicializa como un array vacío

  
  constructor() { }


  
  async inicializarPlugin(): Promise<boolean> {
    try {
      this.platform = Capacitor.getPlatform();
      if (this.platform === 'ios' || this.platform === 'android') {
        this.native = true;
      }
      this.sqlitePlugin = CapacitorSQLite;
      this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
      this.isService = true;
      return true;
    } catch (error) {
      console.error('Error inicializando el plugin de SQLite:', error);
      return false;
    }
  }
  

  async inicializarAlmacenamientoWeb(): Promise<void> {
    try {
      await this.sqliteConnection.initWebStore();
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`initWebStore: ${err}`);
    }
  }

  async abrirBaseDeDatos(dbName: string, encrypted: boolean, mode: string,
    version: number, readonly: boolean): Promise<SQLiteDBConnection> 
  {
    let db: SQLiteDBConnection;
    const retCC = (await this.sqliteConnection.checkConnectionsConsistency()).result;
    let isConn = (await this.sqliteConnection.isConnection(dbName, readonly)).result;
    if(retCC && isConn) {
      db = await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } else {
      db = await this.sqliteConnection.createConnection(dbName, encrypted, mode, version, readonly);
    }
    await db.open();
    return db;
  }

  async recuperarConexion(dbName: string, readonly: boolean): Promise<SQLiteDBConnection> {
    return await this.sqliteConnection.retrieveConnection(dbName, readonly);
  }

  async cerrarConexion(database:string, readonly?: boolean): Promise<void> {
    const readOnly = readonly ? readonly : false;
    return await this.sqliteConnection.closeConnection(database, readOnly);
  }

  async crearBaseDeDatos(dbName: string, encrypted: boolean = false): Promise<void> {
    const db = await this.abrirBaseDeDatos(dbName, encrypted, 'no-encryption', 1, false);
    
    for (const upgrade of this.userUpgrades) {
        await db.execute(upgrade.statements);
    }

    await db.close(); // Cierra la conexión después de completar las operaciones
  }

  async guardarNombreBaseDeDatos(dbName: string) : Promise<void> {
    return await this.sqliteConnection.saveToStore(dbName);
  }

  async eliminarBaseDeDatos(dbName: string) {
    return this.sqlitePlugin.deleteDatabase({ database: dbName });
  }

  private inicializarUpgrades() {
    this.userUpgrades.push({
      statements: 'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nombre TEXT, correo TEXT)'
    });
    // Agrega más declaraciones aquí si es necesario
  }
}
