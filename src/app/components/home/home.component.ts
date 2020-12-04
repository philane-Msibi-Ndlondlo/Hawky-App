import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
   }

  ngOnInit(): void {
  }

  loginUser(loginForm: FormGroup) {
    console.log(loginForm.value);

    if (!loginForm.valid) {
      this.toastr.error('Something went wrong. Try again later!', 'Error');
      return;
    }

    let user: User = {
      email: loginForm.value.email.toLowerCase(),
      password: loginForm.value.password
    };

    this.auth.loginUser(user).subscribe( data => {
      this.auth.setUserToken(data.token, data.user);
      this.toastr.success(data.message, data.status);
      this.router.navigate(['/dashboard']);
    }, err => {
      this.toastr.error(err.error.message, err.error.status);
    });
  }

}
