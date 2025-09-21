import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { ILoginResponse } from '../interfaces/login.interface';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  private router = inject(Router);
  onlineUsers = signal<string[]>([]);

  createHubConnection(loggedInUser: ILoginResponse) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => loggedInUser.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => {
      console.log(error);
    });

    this.hubConnection.on('GetOnlineUsers', (usernames) => {
      this.onlineUsers.set(usernames.result || []);
    });

    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr
        .info(knownAs + ' has sent a new message')
        .onTap.pipe(take(1))
        .subscribe(() => {
          this.router.navigateByUrl('/members/' + username + '?tab="Messages');
        });
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => {
      console.log(error);
    });
  }
}
