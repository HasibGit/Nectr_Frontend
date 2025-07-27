import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AuthService } from '../../../services/auth.service';
import { UserParams } from '../../../interfaces/userParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    MemberCardComponent,
    PaginationModule,
    FormsModule,
    ButtonsModule,
    CommonModule,
  ],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
})
export class MembersListComponent implements OnInit {
  memberService = inject(MemberService);
  genderList = [
    { value: 'male', displayName: 'Male' },
    { value: 'female', displayName: 'Female' },
  ];

  ngOnInit(): void {
    if (!this.memberService.members()) {
      this.loadMembers();
    }
  }

  loadMembers(): void {
    this.memberService.getMembers();
  }

  onPageChange(event: any): void {
    if (this.memberService.userParams().pageNumber !== event.page) {
      this.memberService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }

  resetFilters(): void {
    this.memberService.resetUserParams();
    this.loadMembers();
  }
}
