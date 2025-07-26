export interface ILogin {
  username: string;
  password: string;
}

export interface ILoginResponse {
  userName: string;
  knownAs: string;
  token: string;
  gender: string;
  photoUrl?: string;
}
