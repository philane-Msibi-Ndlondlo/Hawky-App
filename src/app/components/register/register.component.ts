import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  regForm: FormGroup;
  constructor(private fb: FormBuilder, private toastr: ToastrService, private auth: AuthService ) {
    this.regForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]]
    });
   }

  ngOnInit(): void {
  }

  registerUser(form: FormGroup) {
    console.log(form.value);

    if (form.value.password !== form.value.ConfirmPassword) {
      this.toastr.error('Password does not match!', 'Error');
      return;
    }

    if (!form.valid) {
      this.toastr.error('Something went wrong. Try again Later!', 'Error');
      return;
    }

    let user: User = {
      firstname: form.value.firstName,
      lastname: form.value.lastName,
      email: form.value.email.toLowerCase(),
      password: form.value.password
    };

    this.auth.registerUser(user).subscribe((data) => {
      this.toastr.success('Registration Successful! You can log in');
      this.regForm.reset();
    }, err => {
      this.toastr.error(err.error.message, err.error.status);
      console.log(err);
    });

  }

}
