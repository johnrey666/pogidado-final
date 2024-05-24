import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../posts.service';
import { Post } from '../post.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private searchQuerySubscription: Subscription = new Subscription();
  private postUpdateSub!: Subscription;
  searchQuery: string = '';
  posts: Post[] = [];
  editingPostId: string | null = null;
  currentPage = 1;
  totalPosts = 0;
  postsPerPage = 6;
  pageSizeOptions = [3, 5, 8, 10];
  pages: number[] = [];
  expandedPanelId: string | null = null;

  constructor(public postsService: PostService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
   // Subscribe to the search query changes
   this.searchQuerySubscription = this.postsService.searchQuery$.subscribe(query => {
     this.searchQuery = query;
     this.currentPage = 1; // Reset page number when search query changes
     this.getPosts(); // Update posts based on new search query
   });
   // Fetch posts initially
   this.getPosts();
 
   // Subscribe to post updates
   this.postUpdateSub = this.postsService.getPostUpdateListener().subscribe(data => {
     this.posts = data.posts;
     this.totalPosts = data.postCount;
     this.calculatePagination();
   });
 }
 
 getPosts(): void {
   this.postsService.getPosts(this.currentPage, this.postsPerPage, this.searchQuery).subscribe(data => {
     this.posts = data.posts;
     this.totalPosts = data.totalPosts;
     this.calculatePagination();
     console.log('Posts after search:', this.posts); // Log the posts to check if they are updated based on the search query
   });
 }

 ngOnDestroy() {
   // Unsubscribe to prevent memory leaks
   this.searchQuerySubscription.unsubscribe();
   this.postUpdateSub.unsubscribe();
   console.log('PostListComponent destroyed.');
 }

 onPageChange(newPage: number): void {
   this.currentPage = newPage;
   this.router.navigate(['/list'], { queryParams: { p: this.currentPage, q: this.searchQuery } });
   this.getPosts();
 }

 onPageSizeChange(newPageSize: number): void {
   this.postsPerPage = newPageSize;
   this.getPosts();
 }

 onDeletePost(postId: string) {
   this.postsService.deletePost(postId).subscribe(() => {
     this.getPosts();
   });
 }

 onEditPost(postId: string) {
   this.editingPostId = postId;
 }
 onSearch(event: Event): void {
   const target = event.target as HTMLInputElement;
   if (target) {
     const searchQuery = target.value;
     console.log('Search query:', searchQuery); // Log search query for debugging
     this.postsService.setSearchQuery(searchQuery); // Set search query in the service
   }
 }


 filterPosts(query: string): Post[] {
   return this.posts.filter(post => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query));
 }
 
 onSavePost(postId: string, updatedPost: Post) {
   this.postsService.editPost(postId, updatedPost).subscribe(() => {
     const index = this.posts.findIndex(post => post._id === postId);
     if (index !== -1) {
       this.posts[index] = updatedPost;
     }
     this.editingPostId = null;
   }, error => {
     console.error('Error saving post:', error);
   });
 }
 onCancelEdit() {
   this.editingPostId = null;
 }

 calculatePagination(): void {
   this.pages = [];
   const pageCount = Math.ceil(this.totalPosts / this.postsPerPage);
   for (let i = 1; i <= pageCount; i++) {
     this.pages.push(i);
   }
 }

  onImageClick(postId: string) {
    if (this.editingPostId !== postId) {
      console.log('Not in editing mode, cannot edit image.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const target = e.target as FileReader;
            const imageUrl = target.result as string;
            const post = this.posts.find(p => p._id === postId);
            if (post) {
              post.imageUrl = imageUrl;
              console.log('Image preview updated with new imageUrl:', post.imageUrl);
            }
          };
          reader.readAsDataURL(file);
        }
      }
      document.body.removeChild(input);
    };

    input.click();
  }

  panelExpanded(panelId: string) {
    this.expandedPanelId = panelId;
  }

  panelCollapsed() {
    this.expandedPanelId = null;
  }

  isVideo(url: string): boolean {
    return url.toLowerCase().endsWith('.mp4');
  }

  playVideo(event: MouseEvent) {
    const videoElement = event.target as HTMLVideoElement;
    videoElement.play();
  }

  pauseVideo(event: MouseEvent) {
    const videoElement = event.target as HTMLVideoElement;
    videoElement.pause();
  }
}
