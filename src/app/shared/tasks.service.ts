import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from "rxjs/operators";

export interface Task {
  id?: string,
  title: string,
  date?: string
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {  
  constructor(private firestore: AngularFirestore) { }

  load(date: moment.Moment): Observable<Task[]>{
    return this.firestore
      .doc(`tasks/${date.format('DD-MM-YYYY')}`)
      .collection<Task>('items')
      .valueChanges();
  }

  create(task: Task): Observable<Task> {
    task.id = this.firestore.createId();
    return from(this.firestore
      .collection(`tasks/${task.date}/items`)
      .doc(task.id)
      .set(task))
      .pipe(
        map(() => task)
      );
  }

  remove(task: Task): Observable<void> {
    return from(this.firestore
      .collection(`tasks/${task.date}/items`)
      .doc(task.id)
      .delete());
  }
}
