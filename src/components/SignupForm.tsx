import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupRequestSchema, type SignupRequest } from '../../shared/schemas.js';
import { authService } from '../services/auth.js';
import { useState } from 'react';

interface SignupFormProps {
  onSuccess?: (data: SignupRequest) => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupRequest>({
    resolver: zodResolver(signupRequestSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignupRequest) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await authService.signup(data);
      console.log('Signup successful:', response);
      onSuccess?.(data);
    } catch (error) {
      console.error('Signup failed:', error);
      setSubmitError(
        error instanceof Error ? error.message : '회원가입에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="signup-form" noValidate>
      <fieldset>
        <legend className="sr-only">회원 정보 입력</legend>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            이메일 <span className="required" aria-label="필수 입력">*</span>
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
            비밀번호 <span className="required" aria-label="필수 입력">*</span>
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className={`input-field ${errors.password ? 'error' : ''}`}
            placeholder="6자 이상의 비밀번호를 입력하세요"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
          />
          <div id="password-help" className="help-text">
            최소 6자 이상 입력해주세요.
          </div>
          {errors.password && (
            <div id="password-error" className="error-message" role="alert">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            이름 <span className="required" aria-label="필수 입력">*</span>
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className={`input-field ${errors.name ? 'error' : ''}`}
            placeholder="이름을 입력하세요"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <div id="name-error" className="error-message" role="alert">
              {errors.name.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            전화번호 <span className="required" aria-label="필수 입력">*</span>
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="tel"
            className={`input-field ${errors.phone ? 'error' : ''}`}
            placeholder="010-1234-5678"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <div id="phone-error" className="error-message" role="alert">
              {errors.phone.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="birth_date" className="form-label">
            생년월일 <span className="required" aria-label="필수 입력">*</span>
          </label>
          <input
            {...register('birth_date')}
            id="birth_date"
            type="date"
            className={`input-field ${errors.birth_date ? 'error' : ''}`}
            aria-invalid={!!errors.birth_date}
            aria-describedby={errors.birth_date ? 'birth-date-error' : undefined}
          />
          {errors.birth_date && (
            <div id="birth-date-error" className="error-message" role="alert">
              {errors.birth_date.message}
            </div>
          )}
        </div>

        <fieldset className="form-group">
          <legend className="form-label">
            성별 <span className="required" aria-label="필수 입력">*</span>
          </legend>
          <div className="radio-group">
            <label className="radio-label">
              <input
                {...register('gender')}
                type="radio"
                value="M"
                className="radio-input"
              />
              <span>남성</span>
            </label>
            <label className="radio-label">
              <input
                {...register('gender')}
                type="radio"
                value="F"
                className="radio-input"
              />
              <span>여성</span>
            </label>
          </div>
          {errors.gender && (
            <div className="error-message" role="alert">
              {errors.gender.message}
            </div>
          )}
        </fieldset>

        <div className="form-group">
          <label htmlFor="wca_id" className="form-label">
            WCA ID <span className="optional">(선택사항)</span>
          </label>
          <input
            {...register('wca_id')}
            id="wca_id"
            type="text"
            className={`input-field ${errors.wca_id ? 'error' : ''}`}
            placeholder="예: 2022HONG01"
            aria-invalid={!!errors.wca_id}
            aria-describedby={errors.wca_id ? 'wca-id-error' : undefined}
          />
          {errors.wca_id && (
            <div id="wca-id-error" className="error-message" role="alert">
              {errors.wca_id.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="emergency_contact" className="form-label">
            비상연락처 <span className="required" aria-label="필수 입력">*</span>
          </label>
          <input
            {...register('emergency_contact')}
            id="emergency_contact"
            type="text"
            className={`input-field ${errors.emergency_contact ? 'error' : ''}`}
            placeholder="비상시 연락할 분의 이름"
            aria-invalid={!!errors.emergency_contact}
            aria-describedby={errors.emergency_contact ? 'emergency-contact-error' : undefined}
          />
          {errors.emergency_contact && (
            <div id="emergency-contact-error" className="error-message" role="alert">
              {errors.emergency_contact.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="emergency_phone" className="form-label">
            비상연락처 전화번호 <span className="required" aria-label="필수 입력">*</span>
          </label>
          <input
            {...register('emergency_phone')}
            id="emergency_phone"
            type="tel"
            className={`input-field ${errors.emergency_phone ? 'error' : ''}`}
            placeholder="010-1234-5678"
            aria-invalid={!!errors.emergency_phone}
            aria-describedby={errors.emergency_phone ? 'emergency-phone-error' : undefined}
          />
          {errors.emergency_phone && (
            <div id="emergency-phone-error" className="error-message" role="alert">
              {errors.emergency_phone.message}
            </div>
          )}
        </div>
      </fieldset>

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
        {isSubmitting ? '가입 중...' : '회원가입'}
      </button>
    </form>
  );
}
