import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { take } from 'rxjs';
import { IUser } from '../../../interfaces/admin.interface';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  users: IUser[] = [];

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService
      .getUserWithRoles()
      .pipe(take(1))
      .subscribe({
        next: (users) => (this.users = users),
      });
  }
}
