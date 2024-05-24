import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post/posts.service';
import { Post } from '../post/post.model';
import { FormGroup, FormControl } from '@angular/forms';
declare var require: any;
const jwt_decode = require('jwt-decode');

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post?: Post;
  relatedPosts: Post[] = [];
  newComment: string = ''; // Simplified to just a string
  comments: { name: string; comment: string }[] = [];
  commentForm!: FormGroup;
  postId: string | null = null;
  userId: string | null = null;
  


  constructor(private route: ActivatedRoute, private postService: PostService) {
    this.commentForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      comment: new FormControl('')
    }); // Initialize the FormGroup with FormControl instances
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const postId = sessionStorage.getItem('currentPostId');
    this.postId = this.route.snapshot.paramMap.get('postId');

    // Decoding JWT token to get userId
    const token = localStorage.getItem('authToken'); // Adjust if your token is stored differently
    if (token) {
      const decodedToken = jwt_decode.default(token);
      this.userId = decodedToken.sub; // Assuming 'sub' is the claim holding the user ID
    }

    console.log('ID from route:', id);
  
    if (id!== null) {
      this.postService.getPostById(id).subscribe(
        post => {
          this.post = post;
          // Subscribe to allPosts$ to get all posts and temporarily assign them to relatedPosts
          this.postService.allPosts$.subscribe(allPosts => {
            console.log('All Posts:', allPosts); 
            // Temporarily assign all posts to relatedPosts for testing
            this.relatedPosts = allPosts;
            // Optionally, you can add back your filtering logic here later
          }, error => {
            console.error('Error fetching all posts:', error);
          });
        },
        error => {
          console.error('Error fetching post:', error);
        }
      );
    } else {
      console.warn('ID is null');
    }
  }


isVideo(url: string): boolean {
  return url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.ogg');
}

playVideo(event: MouseEvent) {
  const videoElement = (event.target as HTMLVideoElement);
  videoElement.play();
}

pauseVideo(event: MouseEvent) {
  const videoElement = (event.target as HTMLVideoElement);
  videoElement.pause();
}

onSubmitComment() {
  if (this.commentForm.valid) {
    const commentContent = this.commentForm.value.comment;
    const postId = 'extractedOrStoredPostId'; // Replace with actual extraction or retrieval logic
    const userId = 'extractedOrStoredUserId'; // Replace with actual extraction or retrieval logic

    this.postService.addComment(commentContent, postId, userId).subscribe(response => {
      console.log('Comment added successfully:', response);
    }, error => {
      console.error('Error adding comment:', error);
    });

    this.commentForm.reset();
  }
}
}
