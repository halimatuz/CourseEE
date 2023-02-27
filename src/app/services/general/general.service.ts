import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { General } from '../general/general.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private dbPath = '/general';

  genRef: AngularFirestoreCollection<General>;

  constructor(private db: AngularFirestore) {
    this.genRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<General> {
    return this.genRef;
  }

  create(general: General): any {
    return this.genRef.add({ ...general });
  }

  update(id: string, data: any): Promise<void> {
    return this.genRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.genRef.doc(id).delete();
  }
}
