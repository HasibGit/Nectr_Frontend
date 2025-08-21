import {
  Component,
  inject,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { IMessage } from '../../interfaces/message';
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
  messages = input.required<IMessage[]>();
  messageContent = '';
  updateMessages = output<IMessage>();
  private messageService = inject(MessageService);

  sendMessage() {
    this.messageService
      .sendMessage(this.username(), this.messageContent)
      .pipe(take(1))
      .subscribe({
        next: (message) => {
          this.updateMessages.emit(message);
          this.messageForm.reset();
        },
      });
  }
}
