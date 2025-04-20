import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MembersListComponent } from './components/members/members-list/members-list.component';
import { MembersDetailComponent } from './components/members/members-detail/members-detail.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Public route

  // Protected routes
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MembersListComponent },
      { path: 'members/:id', component: MembersDetailComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ],
  },

  { path: '**', component: HomeComponent, pathMatch: 'full' }, // Wildcard route
];
