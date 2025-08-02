import { Component, inject, OnInit } from '@angular/core';
import { LikesService } from '../../services/likes.service';
import { IMember } from '../../interfaces/member.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    CommonModule,
    ButtonsModule,
    FormsModule,
    MemberCardComponent,
    PaginationModule,
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
})
export class ListsComponent implements OnInit {
  private likesService = inject(LikesService);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  paginatedResult = this.likesService.paginatedResult;

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize);
  }

  pageChanged(event: any): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
