// src/shared/api/base.ts
import axios from "axios";
import { API_URL } from "@/shared/config";

interface LoginResponse {
  accessToken?: string;
}

// API 인스턴스 생성
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 저장을 위한 변수
let accessToken: string | null = null;

// 로그인 함수
const login = async () => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/user/login`, {
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
    });

    // response header에서 토큰 추출
    const token =
      response.headers["accesstoken"] || response.headers["authorization"];
    if (!token) {
      throw new Error("Failed to get access token from response headers");
    }

    accessToken = token;
    return token;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // 토큰이 없으면 로그인 시도
    if (!accessToken) {
      accessToken = await login();
    }

    // 토큰을 헤더에 추가
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않았던 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 재발급을 위한 로그인 재시도
        accessToken = await login();

        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        console.error("Token refresh failed:", error);
        // 토큰 초기화
        accessToken = null;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
