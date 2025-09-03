import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { IDatabaseService, QueryResult } from './types';

// --- Para Móvil (iOS/Android) ---
// Este servicio interactúa directamente con la base de datos SQLite local en el dispositivo.
const MobileService: IDatabaseService = {
  db: SQLite.openDatabaseSync('pos.db'),

  async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        // ¡Importante! Aquí debes pegar el esquema COMPLETO de tu base de datos.
        // Este es solo un ejemplo.
        const schema = `
          CREATE TABLE IF NOT EXISTS products (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              price_usd REAL NOT NULL,
              cost_price_usd REAL DEFAULT 0.0,
              stock_quantity REAL DEFAULT 0,
              unit TEXT NOT NULL DEFAULT 'unit'
          );
        `;
        tx.executeSql(
          schema,
          [],
          () => resolve(),
          (_, error) => {
            console.error("Error al inicializar la base de datos móvil:", error);
            reject(error);
            return false; // Detener la transacción
          }
        );
      });
    });
  },

  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result as unknown as QueryResult),
          (_, error) => {
            console.error("Error en la consulta móvil:", error);
            reject(error);
            return false; // Detener la transacción
          }
        );
      });
    });
  },
};

// --- Para Web ---
// Este servicio envía peticiones de red a nuestro servidor Express.
const WebService: IDatabaseService = {
  // Nota: Para emuladores de Android, la URL podría ser 'http://10.0.2.2:3000'
  API_URL: 'http://localhost:3000',

  async initializeDatabase(): Promise<void> {
    // La inicialización es manejada por el servidor, así que no hacemos nada aquí.
    return Promise.resolve();
  },

  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    try {
      const response = await fetch(`${this.API_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'La petición a la API falló');
      }

      const result = await response.json();
      // Aseguramos que el resultado tenga la misma estructura que el móvil
      if (!result.rows || !result.rows._array) {
        throw new Error('La respuesta de la API no tiene el formato esperado.');
      }
      return result as QueryResult;
    } catch (error) {
      console.error('Error en la consulta del WebService:', error);
      throw error;
    }
  },
};

// --- Exportar el servicio correcto basado en la plataforma ---
const dbService = Platform.OS === 'web' ? WebService : MobileService;

// Exportamos una única instancia para ser usada en toda la app
export const db = dbService;