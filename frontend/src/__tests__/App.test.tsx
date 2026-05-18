import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function renderApp() {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('App', () => {
  it('renders login page by default', () => {
    renderApp();
    expect(screen.getByText('CodePilot Agent')).toBeTruthy();
    expect(screen.getByText('AI 开发与毕设自动化平台')).toBeTruthy();
  });

  it('shows login and register tabs', () => {
    renderApp();
    expect(screen.getByText('登录')).toBeTruthy();
    expect(screen.getByText('注册')).toBeTruthy();
  });
});
