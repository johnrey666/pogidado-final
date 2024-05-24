import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './post/post-create/post-create.component'; 
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule} from '@angular/material/input';
import{ HeaderComponent } from './header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { PostListComponent } from './post/post-list/post-list.component';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CeilPipe } from './ceil.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './post/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { AuthGuard } from './auth.guard';
import { PostDetailsComponent } from './post-details/post-details.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ProfileComponent } from './profile/profile.component';




// Define your routes
const appRoutes: Routes = [
 { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
 { path: 'list', component: PostListComponent, canActivate: [AuthGuard] },
 { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
 { path: 'login', component: AuthComponent },
 { path: 'post/:id', component: PostDetailsComponent, canActivate: [AuthGuard] },
 { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
];

@NgModule({
 declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    CeilPipe,
    AuthComponent,
    PostDetailsComponent,
    TruncatePipe,
    ProfileComponent
 ],
 imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    MatExpansionModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule,
    RouterModule.forRoot(appRoutes) // Add routes to AppModule
 ],
 exports: [RouterModule],
 providers: [AuthService],
 bootstrap: [AppComponent]
})
export class AppModule { }
