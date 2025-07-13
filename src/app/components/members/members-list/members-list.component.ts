import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
})
export class MembersListComponent implements OnInit {
  memberService = inject(MemberService);
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    if (!this.memberService.members()) {
      this.loadMembers();
    }
  }

  loadMembers(): void {
    this.memberService.getMembers(this.pageNumber, this.pageSize);
  }

  onPageChange(event: any): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
