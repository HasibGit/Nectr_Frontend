export interface ILogin {
  username: string;
  password: string;
}

export interface ILoginResponse {
  userName: string;
  token: string;
  photoUrl?: string;
}
