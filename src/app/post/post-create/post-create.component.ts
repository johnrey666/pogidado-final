import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
    enteredTitle = '';
    enteredContent = '';
    enteredImageUrl = ''; 
    enteredVideoUrl = ''; 
    uploadedImageUrl = ''; 
    constructor(public postsService: PostService, private router: Router) {}

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const fileType = file.type.split('/')[0];
                    if (fileType === 'image') {
                        this.uploadedImageUrl = e.target.result;
                        this.enteredImageUrl = e.target.result; 
                    } else if (fileType === 'video') {
                        this.enteredVideoUrl = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }
    
    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }
      
        const title = form.value.title;
        const content = form.value.content;
        const imageUrl = form.value.imageUrl; 
        const videoUrl = form.value.videoUrl;
    
        console.log('Form Values:', title, content, imageUrl, videoUrl); // Add this console log
    
        // Call the addPost method with the extracted values
        this.postsService.addPost(title, content, imageUrl, videoUrl).subscribe(() => {
            form.resetForm();
            // Reset the uploadedImageUrl and enteredVideoUrl to clear the previous upload
            this.uploadedImageUrl = '';
            this.enteredVideoUrl = '';
            // Navigate to the post-list page
            this.router.navigate(['/list']);
        });
    }
}    