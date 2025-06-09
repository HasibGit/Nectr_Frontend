import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { AuthService } from '../../../services/auth.service';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryModule } from 'ng-gallery';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    GalleryModule,
    FormsModule,
    PhotoEditorComponent,
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss',
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify(event: any) {
    if (this.editForm?.dirty) {
      event.returnValue = true;
    }
  }

  member: IMember;
  private authService = inject(AuthService);
  private memberService = inject(MemberService);
  private toastr = inject(ToastrService);

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

  onSaveChanges(): void {
    this.memberService
      .updateMember(this.member)
      .pipe(take(1))
      .subscribe({
        next: (_) => {
          this.toastr.success('Profile updated successfully!');
          this.editForm.reset(this.member);
        },
      });
  }

  onMemberChange(event: IMember) {
    this.member = event;
  }
}
