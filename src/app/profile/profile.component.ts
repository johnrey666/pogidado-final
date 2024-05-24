import { Component, OnInit } from '@angular/core';
import { AuthService } from '../post/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: any; // Replace with your user type if available
  private subscription?: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.subscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }
}
