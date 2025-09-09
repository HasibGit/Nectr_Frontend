import { Component, computed, inject, input } from '@angular/core';
import { IMember } from '../../../interfaces/member.interface';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';
import { CommonModule } from '@angular/common';
import { PresenceService } from '../../../services/presence.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss',
})
export class MemberCardComponent {
  member = input.required<IMember>();
  likesService = inject(LikesService);
  private presenceService = inject(PresenceService);

  isOnline = computed(() => {
    const onlineUsers = this.presenceService.onlineUsers();
    return onlineUsers ? onlineUsers?.includes(this.member().userName) : false;
  });

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
