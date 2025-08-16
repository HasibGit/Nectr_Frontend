import { ResolveFn } from '@angular/router';
import { IMember } from '../interfaces/member.interface';
import { inject } from '@angular/core';
import { MemberService } from '../services/member.service';

export const memberResolver: ResolveFn<IMember | null> = (route, _) => {
  const memberService = inject(MemberService);
  const userName = route.paramMap.get('username');

  if (!userName) return null;

  return memberService.getMember(userName);
};
