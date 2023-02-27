import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Specific } from '../specific/specific.model';

@Injectable({
  providedIn: 'root'
})
export class SpecificService {
  private dbPath = '/specific';

  SpeRef: AngularFirestoreCollection<Specific>;

  constructor(private db: AngularFirestore) {
    this.SpeRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Specific> {
    return this.SpeRef;
  }

  create(spec: Specific): any {
    return this.SpeRef.add({ ...spec });
  }

  update(id: string, data: any): Promise<void> {
    return this.SpeRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.SpeRef.doc(id).delete();
  }
}
