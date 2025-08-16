import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
export class MembersDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  private memberService = inject(MemberService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  member: IMember;
  images: GalleryItem[] = [];
  activeTab: TabDirective;
  messages: IMessage[] = [];

  ngOnInit(): void {
    this.loadMember();
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;

    if (this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (messages) => (this.messages = messages),
      });
    }
  }

  loadMember() {
    const userName = this.route.snapshot.paramMap.get('username');

    if (!userName) {
      return;
    }

    this.memberService
      .getMember(userName)
      .pipe(take(1))
      .subscribe({
        next: (member) => {
          this.member = member;
          member.photos.forEach((photo) => {
            this.images.push(
              new ImageItem({ src: photo.url, thumb: photo.url })
            );
          });
        },
      });
  }
}
