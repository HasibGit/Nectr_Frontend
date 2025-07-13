import { Component, inject, OnInit } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [MemberCardComponent],
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
}
