import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationResult } from '../interfaces/pagination';
import { IMessage } from '../interfaces/message';
import { PaginationHelperService } from './pagination-helper.service';
import { Observable } from 'rxjs';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ILoginResponse } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.baseUrl;
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  private paginationHelperService = inject(PaginationHelperService);
  hubConnection?: HubConnection;
  paginatedResult = signal<PaginationResult<IMessage[]> | null>(null);
  messageThread = signal<IMessage[]>([]);

  createHubConnection(user: ILoginResponse, otherUserName: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUserName, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => {
      console.log(error);
    });

    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThread.set(messages);
    });

    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread.update((messages) => [...messages, message]);
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => {
        console.log(error);
      });
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = this.paginationHelperService.setPaginationHeaders(
      pageNumber,
      pageSize
    );

    params = params.append('Container', container);

    return this.http
      .get<IMessage[]>(this.baseUrl + '/api/messages', {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          this.paginationHelperService.setPaginationResponse(
            response,
            this.paginatedResult
          ),
      });
  }

  getMessageThread(username: string) {
    return this.http.get<IMessage[]>(
      this.baseUrl + '/api/messages/thread/' + username
    );
  }

  async sendMessage(
    username: string,
    content: string
  ): Promise<IMessage | undefined> {
    if (!this.hubConnection) {
      throw new Error('Hub connection not established');
    }

    if (this.hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('Hub connection not connected');
    }

    if (!content.trim()) {
      throw new Error('Message content cannot be empty');
    }

    try {
      return await this.hubConnection.invoke('SendMessage', {
        recipientUsername: username,
        content: content.trim(),
      });
    } catch (error) {
      console.error('SignalR invoke error:', error);
      throw error;
    }
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + '/api/messages/' + id);
  }
}
