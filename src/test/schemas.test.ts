import { describe, it, expect } from 'vitest'
import { 
  loginRequestSchema, 
  signupRequestSchema, 
  competitionSchema,
  registrationSchema
} from '../../shared/schemas'

describe('Zod 스키마 검증 테스트', () => {
  describe('loginRequestSchema', () => {
    it('유효한 로그인 데이터를 검증한다', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      }
      
      const result = loginRequestSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('잘못된 이메일을 거부한다', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      }
      
      expect(() => loginRequestSchema.parse(invalidData)).toThrow()
    })

    it('빈 비밀번호를 거부한다', () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      }
      
      expect(() => loginRequestSchema.parse(invalidData)).toThrow()
    })
  })

  describe('signupRequestSchema', () => {
    it('유효한 회원가입 데이터를 검증한다', () => {
      const validData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: '테스트 사용자',
        phone: '010-1234-5678',
        birth_date: '2000-01-01T00:00:00.000Z',
        gender: 'M' as const,
        emergency_contact: '부모님',
        emergency_phone: '010-9876-5432'
      }
      
      const result = signupRequestSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('짧은 비밀번호를 거부한다', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
        name: '테스트 사용자'
      }
      
      expect(() => signupRequestSchema.parse(invalidData)).toThrow()
    })

    it('빈 이름을 거부한다', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        name: ''
      }
      
      expect(() => signupRequestSchema.parse(invalidData)).toThrow()
    })
  })

  describe('competitionSchema', () => {
    it('유효한 대회 데이터를 검증한다', () => {
      const validData = {
        id: 1,
        name: '2025 CCK 챔피언십',
        date: '2025-03-15T10:00:00.000Z',
        location: '서울 올림픽공원',
        base_fee: 20000,
        event_fee: { '3x3': 5000, '2x2': 3000 },
        reg_start_date: '2025-02-01T00:00:00.000Z',
        reg_end_date: '2025-03-01T23:59:59.000Z',
        events: ['3x3', '2x2', '4x4'],
        organizer: 'CCK 조직위원회',
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      }
      
      const result = competitionSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('음수 참가비를 거부한다', () => {
      const invalidData = {
        id: 1,
        name: '테스트 대회',
        date: '2025-03-15T10:00:00.000Z',
        location: '서울',
        base_fee: -1000,
        event_fee: { '3x3': 5000 },
        reg_start_date: '2025-02-01T00:00:00.000Z',
        reg_end_date: '2025-03-01T23:59:59.000Z',
        events: ['3x3'],
        organizer: 'CCK',
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      }
      
      expect(() => competitionSchema.parse(invalidData)).toThrow()
    })

    it('잘못된 상태값을 거부한다', () => {
      const invalidData = {
        id: 1,
        name: '테스트 대회',
        date: '2025-03-15T10:00:00.000Z',
        location: '서울',
        base_fee: 20000,
        event_fee: { '3x3': 5000 },
        reg_start_date: '2025-02-01T00:00:00.000Z',
        reg_end_date: '2025-03-01T23:59:59.000Z',
        events: ['3x3'],
        organizer: 'CCK',
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      }
      
      // competitionSchema는 status 필드가 없으므로 다른 유효성 검사 테스트
      const invalidEventFeeData = {
        ...invalidData,
        event_fee: { '3x3': -1000 } // 음수 이벤트 비용
      }
      
      expect(() => competitionSchema.parse(invalidEventFeeData)).toThrow()
    })
  })

  describe('registrationSchema', () => {
    it('유효한 등록 데이터를 검증한다', () => {
      const validData = {
        id: 1,
        user_id: 1,
        competition_id: 1,
        events: ['3x3', '2x2'],
        total_fee: 25000,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        registered_at: '2025-02-15T00:00:00.000Z',
        updated_at: '2025-02-15T00:00:00.000Z'
      }
      
      const result = registrationSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('빈 이벤트 배열을 거부한다', () => {
      const invalidData = {
        id: 1,
        user_id: 1,
        competition_id: 1,
        events: [],
        total_fee: 25000,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        registered_at: '2025-02-15T00:00:00.000Z',
        updated_at: '2025-02-15T00:00:00.000Z'
      }
      
      expect(() => registrationSchema.parse(invalidData)).toThrow()
    })

    it('음수 총액을 거부한다', () => {
      const invalidData = {
        id: 1,
        user_id: 1,
        competition_id: 1,
        events: ['3x3'],
        total_fee: -1000,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        registered_at: '2025-02-15T00:00:00.000Z',
        updated_at: '2025-02-15T00:00:00.000Z'
      }
      
      expect(() => registrationSchema.parse(invalidData)).toThrow()
    })
  })
})
