import { Component } from '@angular/core';
import { Post } from './post/post.model'
import { AuthService } from './post/auth.service';
import { Router } from '@angular/router';
import { PostService } from './post/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'meanproject';

  constructor(public authService: AuthService, public router: Router, private postService: PostService) { }

  onSearchQueryChange(query: string): void {
    this.postService.setSearchQuery(query);
  }

  isLoginOrAuthPage(): boolean {
    return this.router.url === '/login';
 
}
}
