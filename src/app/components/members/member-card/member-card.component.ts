import { Component, input } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent {
  member = input.required<IMember>();
}
