import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '../models/response';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = 'https://hawky.herokuapp.com/api/attendanceRegister';

  constructor(private http: HttpClient) { }

  registerUser(user: User) {
    return this.http.post(`${this.uri}/users/register`, user);
  }

  loginUser(user: User): Observable<any> {
    return this.http.post(`${this.uri}/users/login`, user);
  }

  setUserToken(token: string, user: User) {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    return JSON.parse(localStorage.getItem('token'));
  }

  logOut() {
    localStorage.clear();
  }
}
