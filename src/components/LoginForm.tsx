import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { loginRequestSchema, type LoginRequest } from '../../shared/schemas.js';
import { authService } from '../services/auth.js';

interface LoginFormProps {
  onSuccess?: (data: LoginRequest) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await authService.login(data);
      console.log('Login successful:', response);
      onSuccess?.(data);
    } catch (error) {
      console.error('Login failed:', error);
      setSubmitError(
        error instanceof Error ? error.message : '로그인에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          이메일{' '}
          <span className="required" aria-label="필수 입력">
            *
          </span>
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          className={`input-field ${errors.email ? 'error' : ''}`}
          placeholder="이메일을 입력하세요"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <div id="email-error" className="error-message" role="alert">
            {errors.email.message}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          비밀번호{' '}
          <span className="required" aria-label="필수 입력">
            *
          </span>
        </label>
        <input
          {...register('password')}
          id="password"
          type="password"
          className={`input-field ${errors.password ? 'error' : ''}`}
          placeholder="비밀번호를 입력하세요"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <div id="password-error" className="error-message" role="alert">
            {errors.password.message}
          </div>
        )}
      </div>

      {submitError && (
        <div className="error-message" role="alert">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={!isValid || isSubmitting}
        aria-describedby={submitError ? 'submit-error' : undefined}
      >
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
