import { Component, inject, OnInit } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { AuthService } from '../../../services/auth.service';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryModule } from 'ng-gallery';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, GalleryModule, FormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss',
})
export class MemberEditComponent implements OnInit {
  member: IMember;
  private authService = inject(AuthService);
  private memberService = inject(MemberService);

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(): void {
    const user = this.authService.loggedInUser();

    if (!user) {
      return;
    }

    this.memberService
      .getMember(user.userName)
      .pipe(take(1))
      .subscribe({
        next: (member) => (this.member = member),
      });
  }
}
