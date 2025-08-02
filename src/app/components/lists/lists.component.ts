import { Component, inject, OnInit } from '@angular/core';
import { LikesService } from '../../services/likes.service';
import { IMember } from '../../interfaces/member.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MemberCardComponent } from '../members/member-card/member-card.component';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, ButtonsModule, FormsModule, MemberCardComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
})
export class ListsComponent implements OnInit {
  private likesService = inject(LikesService);
  members: IMember[] = [];
  predicate = 'liked';

  ngOnInit(): void {
    this.loadLikes();
  }

  getTitle(): string {
    switch (this.predicate) {
      case 'liked':
        return 'People you liked';
      case 'likedBy':
        return 'People who likes you';
      default:
        return 'Mutual';
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate).subscribe({
      next: (members) => (this.members = members),
    });
  }
}
