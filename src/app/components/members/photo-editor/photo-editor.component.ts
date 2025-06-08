import { Component, input } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss',
})
export class PhotoEditorComponent {
  member = input.required<IMember>();
}
