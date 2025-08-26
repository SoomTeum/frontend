import api from '../api';
export type LoginResult = {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  newUser?: boolean;
};

export async function loginWithKakaoCode(code: string) {
  const { data } = await api.get<LoginResult>('/auth/kakao/callback', { params: { code } });
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
}
