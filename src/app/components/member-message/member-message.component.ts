import { Component, inject, input, ViewChild } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { take } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-message',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.scss',
})
export class MemberMessageComponent {
  @ViewChild('messageForm') messageForm: NgForm;
  username = input.required<string>();
  messageContent = '';
  messageService = inject(MessageService);

  sendMessage() {
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .then(() => {
        this.messageForm?.reset();
      });
  }
}
