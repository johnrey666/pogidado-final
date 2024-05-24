import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../post/auth.service';
import { PostService } from '../post/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() searchQueryChange = new EventEmitter<string>();
  currentUser: any;
  private subscription?: Subscription;

  constructor(private router: Router, private authService: AuthService, private postService: PostService) {}

  ngOnInit() {
    this.subscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSearch(query: string): void {
    console.log('Search query emitted:', query); // Check if the search query is emitted
    this.postService.setSearchQuery(query); // Emit the search query to the service
  }
  
}
