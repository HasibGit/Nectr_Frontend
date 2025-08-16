import { Component, inject, input, OnInit } from '@angular/core';
import { IMessage } from '../../interfaces/message';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-message',
  standalone: true,
  imports: [TimeagoModule],
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.scss',
})
export class MemberMessageComponent implements OnInit {
  username = input.required<string>();
  messages = input.required<IMessage[]>();
  private messageService = inject(MessageService);

  ngOnInit(): void {}
}
