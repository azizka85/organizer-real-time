import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { from, Observable } from "rxjs";
import { map } from 'rxjs/operators';

export interface Task {
  id?: string,
  title: string,
  date?: string
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private db: AngularFireDatabase) { }

  load(date: moment.Moment): Observable<Task[]>{
    return this.db
      .list<Task>(`tasks/${date.format('DD-MM-YYYY')}`)
      .snapshotChanges()
      .pipe(
        map(changes => changes
          .map(action => {
            const task = action.payload.val();
            task.id = action.payload.key;
            return task;
          })
        )
      );
  }

  create(task: Task): Observable<void> {
    return from(this.db
      .list<Task>(`tasks/${task.date}`)
      .push(task))
      .pipe(
        map(ref => {})
      );
  }

  remove(task: Task): Observable<void> {
    return from(this.db
      .list<Task>(`tasks/${task.date}`)
      .remove(task.id));
  }
}
