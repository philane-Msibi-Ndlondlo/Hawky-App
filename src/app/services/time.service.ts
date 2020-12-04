import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  uri: string = 'https://hawky.herokuapp.com/api/attendanceRegister/time';

  constructor(private http: HttpClient) { }

  getTimetable(email) {
    return this.http.post<any>(`${this.uri}/getTimetable`, {email});
  }

  timeIn(time, date, email) {
    return this.http.post<Response>(`${this.uri}/timein`, {
      email,
      dayDate: date,
      timeIn: time,
      timeOut: '-'
    });
  }

  isTimeIn(date, email) {
    return this.http.post<any>(`${this.uri}/isTimeIn`, {
      email,
      dayDate: date
    });
  }

  //Time Out

  timeOut(time, date, email) {
    return this.http.post<Response>(`${this.uri}/timeout`, {
      email,
      dayDate: date,
      timeOut: time
    });
  }

  isTimeOut(date, email) {
    return this.http.post<any>(`${this.uri}/isTimeOut`, {
      email,
      dayDate: date
    });
  }
}
