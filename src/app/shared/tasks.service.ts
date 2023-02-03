import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CreateResponse } from "../models/create-response.model";
import { Task } from "../models/task.model";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  public static url = environment.fireBaseUrl;

  constructor(private http: HttpClient){}

  load(date: moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
    .pipe(map(tasks => {
      if(!tasks){
        return []
      }
      return Object.keys(tasks).map((key:any) => ({...tasks[key], id: key}))
    }))
  }

  create(task: Task): Observable<Task>{
    // this.http.request(new HttpRequest())
    return this.http.post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
    .pipe(map(res => {
      return {...task, id: res.name}
    }))
  }

  remove(task: Task): Observable<void>{
    return this.http.delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
  }
}