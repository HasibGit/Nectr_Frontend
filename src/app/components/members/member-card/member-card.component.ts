import { Component, inject, input } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent {
  likesService = inject(LikesService);
  member = input.required<IMember>();

  get isLiked(): boolean {
    return this.likesService.likedUserIds().includes(this.member().id);
  }

  toggleLike(): void {
    this.likesService.toggleLike(this.member().id).subscribe({
      next: () => {
        this.likesService.getLikedUserIds();
      },
      error: (error) => {
        console.error('Error toggling like:', error);
      },
    });
  }
}
