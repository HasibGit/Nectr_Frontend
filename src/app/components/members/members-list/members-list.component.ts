import { Component, inject, OnInit } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
})
export class MembersListComponent implements OnInit {
  members: IMember[];

  private memberService = inject(MemberService);

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(): void {
    this.memberService
      .getMembers()
      .pipe(take(1))
      .subscribe({
        next: (members) => (this.members = members),
      });
  }
}
