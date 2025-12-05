/**
 * LoginForm Component Tests
 * Unit tests for LoginForm component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn();

  const renderLoginForm = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <LoginForm
          onSubmit={mockOnSubmit}
          isLoading={false}
          error={null}
          {...props}
        />
      </I18nextProvider>
    );
  };

  it('should render all form fields', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should display validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValueOnce(undefined);
    renderLoginForm();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        remember: true,
      });
    });
  });

  it('should display error message when error prop is provided', () => {
    renderLoginForm({ error: 'Invalid credentials' });

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('should disable submit button when loading', () => {
    renderLoginForm({ isLoading: true });

    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(submitButton).toBeDisabled();
  });

  it('should toggle remember me checkbox', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const rememberCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    expect(rememberCheckbox).toBeChecked(); // Default is true

    await user.click(rememberCheckbox);
    expect(rememberCheckbox).not.toBeChecked();

    await user.click(rememberCheckbox);
    expect(rememberCheckbox).toBeChecked();
  });

  it('should have link to forgot password page', () => {
    renderLoginForm();

    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });
});

