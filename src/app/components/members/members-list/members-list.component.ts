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

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    if (this.memberService.members().length === 0) {
      this.memberService.getMembers();
    }
  }
}
