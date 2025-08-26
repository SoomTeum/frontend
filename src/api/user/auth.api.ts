import api from '../api';
import type { ApiResponse } from '@/types/api-response';

export type LoginResult = {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  newUser?: boolean;
};

export async function loginWithKakaoAccessToken(kakaoAccessToken: string) {
  const { data } = await api.post<ApiResponse<LoginResult>>('/auth/login/kakao', {
    accessToken: kakaoAccessToken,
  });
  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
  return data;
}
