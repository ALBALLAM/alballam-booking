export interface IRefreshTokenParams {
  refresh_token: string;
}

export interface IRefreshTokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_header?: string;
}
