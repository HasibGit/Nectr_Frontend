import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MemberService } from '../../../services/member.service';
import { ActivatedRoute } from '@angular/router';
import { IMember } from '../../../interfaces/member.interface';
import { take } from 'rxjs';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessageComponent } from '../../member-message/member-message.component';
import { IMessage } from '../../../interfaces/message';
import { MessageService } from '../../../services/message.service';
import { PresenceService } from '../../../services/presence.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [
    TabsModule,
    GalleryModule,
    TimeagoModule,
    DatePipe,
    MemberMessageComponent,
  ],
  templateUrl: './members-detail.component.html',
  styleUrl: './members-detail.component.scss',
})
export class MembersDetailComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('memberTabs', { static: false }) memberTabs: TabsetComponent;

  presenceService = inject(PresenceService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  member: IMember;
  images: GalleryItem[] = [];
  activeTab: TabDirective;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.member = data['member'];

        this.member &&
          this.member.photos.forEach((photo) => {
            this.images.push(
              new ImageItem({ src: photo.url, thumb: photo.url })
            );
          });
      },
    });
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe({
      next: (params) => {
        if (params['tab']) {
          this.selectTab(params['tab']);
        }
      },
    });
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;

    if (this.activeTab.heading === 'Messages' && this.member) {
      const user = this.authService.loggedInUser();

      if (!user) return;

      this.messageService.createHubConnection(user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const tab = this.memberTabs.tabs.find((tab) => tab.heading === heading);

      if (tab) {
        tab.active = true;
      }
    }
  }
}
