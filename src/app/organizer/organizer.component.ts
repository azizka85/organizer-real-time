import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../shared/date.service';
import { TasksService, Task } from '../shared/tasks.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  tasks: Task[] = [];
  form: FormGroup;

  constructor(public dateService: DateService,
              private tasksService: TasksService) { }

  ngOnInit(): void {
    this.dateService.date$.pipe(
      switchMap(value => this.tasksService.load(value))
    ).subscribe(tasks => {
      this.tasks = tasks; 
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
    this.form.controls.title.patchValue('');
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
        console.log(`Task ${task.id} created`);
        this.form.reset();
      }, err => {
        console.error(err);
      });
  }

  remove(task: Task) {
    console.log(`Removing task ${task.id}`);
    this.tasksService
      .remove(task)
      .subscribe(() => {
        console.log(`Task ${task.id} deleted`);
      }, err => { 
        console.error(err)
      });
  }
}
