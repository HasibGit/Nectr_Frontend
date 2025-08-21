import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterModule } from '@angular/router';
import { TimeagoModule } from 'ngx-timeago';
import { IMessage } from '../../interfaces/message';
import { take } from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    ButtonsModule,
    FormsModule,
    PaginationModule,
    RouterModule,
    TimeagoModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {
  messageService = inject(MessageService);
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  isOutbox = this.container === 'Outbox';

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getMessages(
      this.pageNumber,
      this.pageSize,
      this.container
    );
  }

  deleteMessage(id: number) {
    this.messageService
      .deleteMessage(id)
      .pipe(take(1))
      .subscribe({
        next: (_) => {
          this.messageService.paginatedResult.update((prev) => {
            if (prev && prev.items) {
              const idx = prev.items.findIndex((m) => m.id === id);
              prev.items.splice(idx, 1);

              return prev;
            }

            return prev;
          });
        },
      });
  }

  getRoute(message: IMessage): string {
    if (this.container === 'Outbox')
      return `/members/${message.recipientUsername}`;
    else return `/members/${message.senderUsername}`;
  }

  pageChanged(event: any): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
