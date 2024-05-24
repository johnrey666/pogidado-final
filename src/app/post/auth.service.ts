// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
 providedIn: 'root'
})
export class AuthService {
 private currentUserSubject: BehaviorSubject<any>;
 public currentUser: Observable<any>;
 private apiUrl = 'http://localhost:3000/api/auth'; // Corrected base URL

 constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
 }

 public get currentUserValue(): any {
    return this.currentUserSubject.value;
 }

 isAuthenticated(): boolean {
   // Implement your logic to check if the user is authenticated
   // For example, check if there's a valid token in localStorage
   return!!localStorage.getItem('token');
 }

 // For signup
 public signup(username: string, password: string): Observable<any> {
   const signupUrl = `${this.apiUrl}/users`;
   return this.http.post(signupUrl, { action: 'signup', username, password });
 }

 public login(username: string, password: string): Observable<any> {
  const loginUrl = `${this.apiUrl}/users`;
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  return this.http.post<any>(loginUrl, { action: 'login', username, password }, { headers })
   .pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login error'));
      })
    );
}

 public refreshToken(refreshToken: string): Observable<any> {
   const headers = new HttpHeaders({
      'Content-Type': 'application/json'
   });
   return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }, { headers })
  .pipe(
        catchError(error => {
          console.error('Refresh token error:', error);
          return throwError(error);
        })
      );
 }

 public logout() {
   // Clear the token and user data from local storage
   localStorage.removeItem('token');
   localStorage.removeItem('currentUser');
   // Optionally, redirect the user to the login page
   this.router.navigate(['/login']);
   // Show a snackbar message
   this.snackBar.open('Session Expired', 'Close', { duration: 3000 });
 }


}
 