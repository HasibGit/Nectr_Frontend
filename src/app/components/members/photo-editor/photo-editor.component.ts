import { Component, inject, input, OnInit, output } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss',
})
export class PhotoEditorComponent implements OnInit {
  authService = inject(AuthService);
  member = input.required<IMember>();
  memberChanged = output<IMember>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.baseUrl;

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
    };
  }
}
