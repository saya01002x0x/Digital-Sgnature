/**
 * Auth Flow Integration Tests
 * Test complete authentication workflows with MSW
 */

import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { setupServer } from 'msw/node';
import { authHandlers } from '@/mocks/features/auth.handlers';
import { store } from '@/app/store';
import i18n from '@/i18n/i18n';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

// Setup MSW server
const server = setupServer(...authHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Auth Flow Integration Tests', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            {component}
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    );
  };

  describe('Login Flow', () => {
    it('should successfully login with valid credentials', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      // Fill in login form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Verify navigation to documents page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/documents');
      });
    });

    it('should display error message for invalid credentials', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'invalid@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials|login failed/i)).toBeInTheDocument();
      });
    });

    it('should remember user when remember me is checked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const rememberCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      expect(rememberCheckbox).toBeChecked(); // Default checked
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/documents');
      });
    });
  });

  describe('Register Flow', () => {
    it('should successfully register with valid data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      // Fill in registration form
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /register/i });

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      // Verify navigation to login page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should display error for existing email', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RegisterPage />);

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /register/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com'); // Existing email
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText(/email already exists|registration failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Complete Auth Workflow', () => {
    it('should complete register → login → logout flow', async () => {
      const user = userEvent.setup();
      
      // Step 1: Register
      const { rerender } = renderWithProviders(<RegisterPage />);

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByRole('checkbox');
      let submitButton = screen.getByRole('button', { name: /register/i });

      await user.type(nameInput, 'Test Complete Flow');
      await user.type(emailInput, 'complete@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });

      // Step 2: Login
      rerender(
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <LoginPage />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      );

      const loginEmailInput = screen.getByLabelText(/email/i);
      const loginPasswordInput = screen.getByLabelText(/password/i);
      submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(loginEmailInput, 'test@example.com');
      await user.type(loginPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/documents');
      });
    });
  });
});

