// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth.guard';
import { PostDetailsComponent } from './post-details/post-details.component';
import { ProfileComponent } from './profile/profile.component';



const routes: Routes = [
 { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] }, // Protect this route
 { path: 'list', component: PostListComponent, canActivate: [AuthGuard] }, // Protect this route
 { path: 'post/:id', component: PostDetailsComponent, canActivate: [AuthGuard] },
 { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
 { path: 'login', component: AuthComponent }, // Add this route for the login page
 { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }