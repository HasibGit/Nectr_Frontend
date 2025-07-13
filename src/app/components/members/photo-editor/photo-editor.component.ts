import { Component, inject, input, OnInit, output } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { IPhoto } from '../../../interfaces/photo.interface';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss',
})
export class PhotoEditorComponent implements OnInit {
  authService = inject(AuthService);
  memberService = inject(MemberService);
  member = input.required<IMember>();
  memberChanged = output<IMember>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.baseUrl;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/api/users/add-photo',
      authToken: `Bearer ${this.authService.loggedInUser()?.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = { ...this.member() };
      updatedMember.photos.push(photo);

      this.memberChanged.emit(updatedMember);

      if (photo.isMain) {
        const user = this.authService.loggedInUser();

        if (user) {
          user.photoUrl = photo.url;
          this.authService.setCurrentUser(user);
        }

        updatedMember.photoUrl = photo.url;

        updatedMember.photos.forEach((p) => {
          if (p.id != photo.id) {
            p.isMain = false;
          } else {
            p.isMain = true;
          }
        });

        this.memberChanged.emit(updatedMember);

        // this.memberService.members.update((members) =>
        //   // members.map((member) => {
        //   //   if (member.userName == user?.userName) {
        //   //     if (!member.photos.includes(photo)) {
        //   //       member.photos.push(photo);
        //   //     }
        //   //   }

        //   //   return member;
        //   // })
        // );
      }
    };
  }

  setAsMain(photo: IPhoto) {
    this.memberService
      .setAsMainProfilePic(photo)
      .pipe(take(1))
      .subscribe({
        next: (_) => {
          const user = this.authService.loggedInUser();

          if (user) {
            user.photoUrl = photo.url;
            this.authService.setCurrentUser(user);
          }

          const updatedMember = { ...this.member() };
          updatedMember.photoUrl = photo.url;

          updatedMember.photos.forEach((p) => {
            if (p.id != photo.id) {
              p.isMain = false;
            } else {
              p.isMain = true;
            }
          });

          this.memberChanged.emit(updatedMember);
        },
      });
  }

  onDelete(photo: IPhoto) {
    const modalRef: BsModalRef = this.modalService.show(ConfirmModalComponent, {
      class: 'modal-sm modal-dialog-centered',
      initialState: {
        title: 'Delete Photo',
        message: 'Are you sure you want to delete this photo?',
        onConfirm: () => this.confirmDelete(photo),
      },
    });
  }

  private confirmDelete(photo: IPhoto) {
    this.memberService
      .deletePhoto(photo)
      .pipe(take(1))
      .subscribe({
        next: (_) => {
          const user = this.authService.loggedInUser();

          if (user && user.photoUrl == photo.url) {
            user.photoUrl = '';
            this.authService.setCurrentUser(user);
          }

          const updatedMember = {
            ...this.member(),
            photos: this.member().photos.filter((p) => p !== photo),
          };

          if (updatedMember.photoUrl == photo.url) {
            updatedMember.photoUrl = '';
          }

          this.memberChanged.emit(updatedMember);
        },
      });
  }
}
