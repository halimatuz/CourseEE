import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Student } from '../student/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private dbPath = '/student';

  StuRef: AngularFirestoreCollection<Student>;

  constructor(private db: AngularFirestore) {
    this.StuRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Student> {
    return this.StuRef;
  }

  create(spec: Student): any {
    return this.StuRef.add({ ...spec });
  }

  update(id: string, data: any): Promise<void> {
    return this.StuRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.StuRef.doc(id).delete();
  }
}
