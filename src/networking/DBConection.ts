import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';

import {DayIndex, DbKeys} from '../constants/screens/dbKeys';

type KeyType = DbKeys | DayIndex;

enablePromise(true);

// This table will have key and value columns only
export const TABLE_OFFLINE_NAME = 'offline_mode';
export const TABLE_CONFIG_NAME = 'config';

export const getDBConnection = async () => {
  return openDatabase({name: 'ventura-travel.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  return await db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL UNIQUE, value TEXT NOT NULL)`,
      [],
      () => null, // Callback on success
      // eslint-disable-next-line no-console
      (tx, error) => console.error('Error creating table: ' + error),
    );
  });
};

export const deleteRow = async (
  db: SQLiteDatabase,
  key: KeyType,
  tableName: string,
) => {
  const query = `DELETE FROM ${tableName} WHERE key="${key}"`;
  await db.executeSql(query);
};

export const emptyLocalTable = async (
  db: SQLiteDatabase,
  tableName: string,
): Promise<any> => {
  const query = `DELETE FROM ${tableName}`;
  return await db.executeSql(query);
};

export const saveDbValue = async (
  db: SQLiteDatabase,
  key: KeyType,
  value: any,
  tableName: string,
): Promise<any> => {
  await db.transaction(tx => {
    tx.executeSql(
      `INSERT or REPLACE INTO ${tableName} (key, value) VALUES (?, ?)`,
      [key, JSON.stringify(value)],
      () => null, // On success callback
      // eslint-disable-next-line no-console
      (_, error) => console.error('Error storing data: ' + error),
    );
  });
};

export const getValueForKey = async (
  key: KeyType,
  cb: any,
  tableName: string,
): Promise<any> => {
  const db = await getDBConnection();

  return await db.transaction(tx => {
    tx.executeSql(
      `SELECT value FROM ${tableName} WHERE key = ?`,
      [key],
      (tx, results) => {
        const len = results.rows.length;

        if (len > 0) {
          const value = results.rows.item(0).value;
          const jsonObj = JSON.parse(value);

          return cb(jsonObj);
        } else {
          cb(null);
        }
      },
      (tx, error) => {
        // eslint-disable-next-line no-console
        console.error('Error reading data: ' + error);
        return cb(key, error);
      },
    );
  });
};

export const readTable = (db: any, tableName: string): void => {
  db.executeSql(
    `SELECT * from ${tableName}`,
    [],
    (tx, results) => {
      const readable = JSON.stringify(results);
      return readable;
    },
    (tx, e) => {
      // eslint-disable-next-line no-console
      console.log('### Error To Read Table:', JSON.parse(e));
    },
  );
};
