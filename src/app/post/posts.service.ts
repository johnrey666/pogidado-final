import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, tap, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private searchQuerySubject = new BehaviorSubject<string>('');
  
  private postUpdated = new Subject<{ posts: Post[]; totalPosts: number }>();
  private apiUrl = 'http://localhost:3000/api/posts';
  private allPostsSubject = new BehaviorSubject<Post[]>([]);
  allPosts$ = this.allPostsSubject.asObservable();

  
  constructor(private http: HttpClient) {
    // Load posts initially
    this.loadPosts();

  }
  
  private loadPosts(): void {
    this.getPosts().subscribe(data => this.allPostsSubject.next(data.posts));
  }

  // Get post update listener
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  
  // Methods for managing search query
  searchQuery$ = this.searchQuerySubject.asObservable();
  
  setSearchQuery(query: string): void {
    console.log('Setting search query:', query); // Check if the search query is received
    this.searchQuerySubject.next(query);
  }
  
  getPosts(page: number = 1, limit: number = 10, title?: string): Observable<{ posts: Post[]; totalPosts: number }> {
    const queryParams = `?page=${page}&limit=${limit}&title=${title ? title : ''}`;
    return this.http.get<{ posts: Post[]; totalPosts: number }>(`${this.apiUrl}${queryParams}`);
  }

  searchPosts(query: string, page: number = 1, limit: number = 10): Observable<{ message: string; posts: Post[]; totalPosts: number }> {
    return this.http.get<{ message: string; posts: Post[]; totalPosts: number }>(`${this.apiUrl}?title=${encodeURIComponent(query)}&page=${page}&limit=${limit}`).pipe(
      map(data => data),
      tap(() => {
        // Optionally handle side effects here
      })
    );
  }
  
  filterPosts(posts: Post[], query: string): Post[] {
    return posts.filter(post => post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query));
  }
  
  addComment(content: string, postId: string, userId: string): Observable<any> {
    const commentData = { content, postId, userId };
    return this.http.post(`${this.apiUrl}/comments`, commentData);
  }

  // Add a post
  addPost(title: string, content: string, imageUrl: string, videoUrl: string): Observable<any> {
    const postData = { title, content, imageUrl, videoUrl };
    return this.http.post(this.apiUrl, postData).pipe(
      tap(() => {
        this.getPosts().subscribe(data => {
          this.allPostsSubject.next(data.posts); // Update the shared list of all posts
        });
      })
    );
  }
  
  // Get a post by ID
  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }
  
  // Delete a post
  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`).pipe(
      tap(() => {
        this.getPosts().subscribe(data => {
          this.allPostsSubject.next(data.posts); // Update the shared list of all posts
        });
      })
    );
  }
  
  // Edit a post
  editPost(postId: string, updatedPost: Post): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}`, updatedPost).pipe(
      tap(() => {
        this.getPosts().subscribe(data => {
          this.allPostsSubject.next(data.posts); // Update the shared list of all posts
        });
      })
    );
  }
  
  // Get related posts by category
  getRelatedPostsByCategory(categoryId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts/${categoryId}`);
  }
}
