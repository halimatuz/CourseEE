import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Program } from './program.model';
@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private dbPath = '/program';

  progRef: AngularFirestoreCollection<Program>;

  constructor(private db: AngularFirestore) {
    this.progRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Program> {
    return this.progRef;
  }

  create(pro: Program): any {
    return this.progRef.add({ ...pro });
  }

  update(id: string, data: any): Promise<void> {
    return this.progRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.progRef.doc(id).delete();
  }
}
