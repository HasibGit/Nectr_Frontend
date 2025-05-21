import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { ActivatedRoute } from '@angular/router';
import { IMember } from '../../../interfaces/member.interface';
import { take } from 'rxjs';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [TabsModule],
  templateUrl: './members-detail.component.html',
  styleUrl: './members-detail.component.scss',
})
export class MembersDetailComponent implements OnInit {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);

  member: IMember;

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const userName = this.route.snapshot.paramMap.get('username');

    if (!userName) {
      return;
    }

    this.memberService
      .getMember(userName)
      .pipe(take(1))
      .subscribe({
        next: (member) => (this.member = member),
      });
  }
}
