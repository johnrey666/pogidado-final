import { AuthService } from '../post/auth.service'; // Ensure the correct path to AuthService
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
 selector: 'app-auth',
 templateUrl: './auth.component.html',
 styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
 isLogin = true;
 username: string = '';
 password: string = '';
 confirmPassword: string = '';

 constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

 @ViewChild('authForm') authForm!: NgForm;

 ngOnInit() {
  
    console.log('AuthComponent initialized');
 }

 switchToLogin(event: Event) {
  event.preventDefault();
  this.isLogin = true;
}

switchToSignup(event: Event) {
  event.preventDefault();
  this.isLogin = false;
}

 onSubmit(event: Event) {
    event.preventDefault();
    if (!this.authForm.valid) {
      // Optionally, show a message that the form is invalid
      return;
    }
    if (this.isLogin) {
      this.onLogin(event);
    } else {
      this.onSignup(event);
    }
 }

 onSignup(event: Event) {
    if (this.password!== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    this.authService.signup(this.username, this.password).subscribe(
      data => {
        console.log('User signed up successfully', data);
        this.snackBar.open('Successfully signed up. Please log in.', 'Close', { duration: 5000 });
        this.isLogin = true;
        this.authForm.resetForm();
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
      },
      error => {
        console.error('Error signing up', error);
        this.snackBar.open('User already exists', 'Close', { duration: 5000 });
      }
    );
 }


onLogin(event: Event) {
    event.preventDefault(); // Prevent the default form submission
    this.authService.login(this.username, this.password).subscribe(
      data => {
        console.log('User logged in successfully', data);
        localStorage.setItem('token', data.token);
        this.router.navigate(['/list']); // Navigate to the post list page on successful login
        this.snackBar.open('Successfully Logged In', 'Close', { duration: 5000 });
        this.autoLogout();

      },
      error => {
        console.error('Error logging in', error);
        // Assuming the error object has a message property that indicates the type of error
        if (error.message === 'Incorrect username or password') {
          this.snackBar.open('Incorrect username or password', 'Close', { duration: 5000 });
        } else {
          // Handle other types of errors or show a generic error message
          this.snackBar.open('No account found', 'Close', { duration: 5000 });
        }
      }
    );
}
autoLogout() {
  setTimeout(() => {
    this.authService.logout(); // Implement logout method in AuthService
  }, 1660000); // 60000 milliseconds = 1 minute
}




 // Add methods for switching between login and signup forms if necessary
}