import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Header } from './Header';
import { AuthContext } from '@/contexts/AuthContext';

const meta: Meta<typeof Header> = {
  title: 'Components/Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

// 1. 비로그인 상태 스토리
export const LoggedOut: Story = {
  render: () => (
    <AuthContext.Provider
      value={{
        user: null,
        isLoading: false,
        isLoggedIn: false,
        login: async () => {},
        logout: () => {},
        refreshUser: async () => {},
      }}
    >
      <Header />
    </AuthContext.Provider>
  ),
};

// 2. 로그인 상태 스토리 (프로필 이미지 없음)
export const LoggedIn: Story = {
  render: () => (
    <AuthContext.Provider
      value={{
        user: {
          id: 1,
          email: 'user@example.com',
          nickname: '테스트유저',
          profileImageUrl: '',
          createdAt: '2026-06-08T00:00:00Z',
          updatedAt: '2026-06-08T00:00:00Z',
        },
        isLoading: false,
        isLoggedIn: true,
        login: async () => {},
        logout: () => {},
        refreshUser: async () => {},
      }}
    >
      <Header />
    </AuthContext.Provider>
  ),
};

// 3. 로그인 상태 스토리 (프로필 이미지 있음)
export const LoggedInWithProfileImage: Story = {
  render: () => (
    <AuthContext.Provider
      value={{
        user: {
          id: 2,
          email: 'test@example.com',
          nickname: '테스트팀',
          profileImageUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256',
          createdAt: '2026-06-08T00:00:00Z',
          updatedAt: '2026-06-08T00:00:00Z',
        },
        isLoading: false,
        isLoggedIn: true,
        login: async () => {},
        logout: () => {},
        refreshUser: async () => {},
      }}
    >
      <Header />
    </AuthContext.Provider>
  ),
};

// 4. 로딩 중 상태 스토리
export const Loading: Story = {
  render: () => (
    <AuthContext.Provider
      value={{
        user: null,
        isLoading: true,
        isLoggedIn: false,
        login: async () => {},
        logout: () => {},
        refreshUser: async () => {},
      }}
    >
      <Header />
    </AuthContext.Provider>
  ),
};
