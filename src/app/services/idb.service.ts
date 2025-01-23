import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { GuessHistoryInterface } from '../interfaces/guess-history-interface';

interface UserProgress {
  id: string; // La chaîne de caractères unique
  data: string; // Le JSON stringifié
}

@Injectable({
  providedIn: 'root'
})
export class IdbService {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    // Initialise la base de données
    this.dbPromise = openDB('MelodisseyDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore("data"); // Clé primaire = id
        }
      },
    });
  }

  // Méthode pour ajouter ou mettre à jour une progression
  async saveProgress(dayID:number, progression: GuessHistoryInterface[],answer:GuessHistoryInterface): Promise<void> {
    const db = await this.dbPromise;
    let data:any = {}
    data={progress:progression,answer:answer};
    await db.put('data', data, dayID);
  }

  // Méthode pour récupérer une progression
  async getProgress(id: number): Promise<UserProgress | undefined> {
    const db = await this.dbPromise;
    return db.get('data', id);
  }

  async getAllProgress(): Promise<Record<number,UserProgress> | undefined> {
    const db = await this.dbPromise;
    // Récupère toutes les clés et toutes les valeurs
    const keys = await db.getAllKeys('data');
    const values = await db.getAll('data');

    // Construit le dictionnaire avec clé-valeur
    const result: Record<number, UserProgress> = {};
    keys.forEach((key, index) => {
      result[key as number] = values[index];
    });
    return result;
  }

  // Méthode pour supprimer une progression
  async deleteProgress(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('data', id);
  }
}
