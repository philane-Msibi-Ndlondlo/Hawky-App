import { Component, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { TimeService } from 'src/app/services/time.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  username: string;
  user: User;
  currectTime: string;
  currectDate: string;
  isTimeIn: boolean;
  isTimeOut: boolean;

  constructor(private auth: AuthService, private time: TimeService, private toastr: ToastrService, private route: Router) {
    setInterval(() => {
      this.currectTime = new Date().toTimeString().toString().substring(0, new Date().toTimeString().toString().indexOf("GMT"));
      this.currectDate = new Date().toDateString().toString();
    }, 1);
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.username = this.user.firstname + ' ' + this.user.lastname;
    this.checkIfTimeIn();
    this.checkIfTimeOut();
  }

  logout() {
    this.auth.logOut();
    this.route.navigate(['/']);
  }

  checkIfTimeIn() {
    this.time.isTimeIn(new Date().toDateString().toString(), this.user.email).subscribe(data => {
      this.isTimeIn = data.message === 'Yes' ? true : false;
      console.log(data);

    });
  }

  checkIfTimeOut() {
    this.time.isTimeOut(new Date().toDateString().toString(), this.user.email).subscribe(data => {
      this.isTimeOut = data.message === 'Yes' ? true : false;
      console.log(data);

    });
  }

  timeIn() {
    console.log(this.currectTime, this.currectDate, this.user.email);
    this.time.timeIn(this.currectTime, this.currectDate, this.user.email).subscribe(data => {
      if (data.status === 'Success') {
        this.toastr.success(data.message, data.status);
        this.checkIfTimeIn();
      }
    }, err => {
      this.toastr.error(err.error.message, err.error.status);
    });
  }

  timeOut() {
    console.log(this.currectTime, this.currectDate, this.user.email);
    this.time.timeOut(this.currectTime, this.currectDate, this.user.email).subscribe(data => {
      if (data.status === 'Success') {
        this.toastr.success(data.message, data.status);
        this.checkIfTimeOut();
      }
    }, err => {
      this.toastr.error(err.error.message, err.error.status);
    });
  }

}
