import api from '../api';
import type { ApiResponse } from '@/types/api-response';

export type LoginResult = {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  newUser?: boolean;
};

export async function loginWithKakaoAccessToken(kakaoAccessToken: string) {
  const body = { KakaoTokenRequestDto: { accessToken: kakaoAccessToken } };

  const { data } = await api.post<ApiResponse<LoginResult>>('/auth/login/kakao', body);
  const payload = typeof data?.success === 'boolean' ? data.data : (data as any);
  localStorage.setItem('accessToken', payload.accessToken);
  localStorage.setItem('refreshToken', payload.refreshToken);
  return payload;
}
