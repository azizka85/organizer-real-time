import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../shared/date.service';
import { TasksService, Task } from '../shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  tasks: Observable<Task[]>;
  form: FormGroup;

  constructor(public dateService: DateService,
              private tasksService: TasksService) { }

  ngOnInit(): void {
    this.tasks = this.dateService.date$.pipe(
      switchMap(value => this.tasksService.load(value))
    );
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit() {
    const { title } = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date$.value.format('DD-MM-YYYY'),      
    }
    this.tasksService
      .create(task)
      .subscribe(task => {
        this.form.reset();
      }, err => {
        console.error(err);
      });
  }

  remove(task: Task) {
    this.tasksService
      .remove(task)
      .subscribe(() => {
        console.log(`Task ${task.id} removed`);
      }, err => { 
        console.error(err)
      });
  }
}
