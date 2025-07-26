import { ILoginResponse } from './login.interface';

export class UserParams {
  gender: string;
  minAge = 18;
  maxAge = 99;
  pageNumber = 1;
  pageSize = 5;

  constructor(user: ILoginResponse) {
    this.gender = user?.gender === 'female' ? 'male' : 'female';
  }
}
