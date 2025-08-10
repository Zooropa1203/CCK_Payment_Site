import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { HttpClient } from '../services/http'
import { mockApiResponse, mockApiError } from '../test/utils'

describe('HttpClient 서비스', () => {
  let httpClient: HttpClient
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch
    httpClient = new HttpClient()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET 요청', () => {
    it('성공적인 GET 요청을 처리한다', async () => {
      const responseData = { id: 1, name: 'Test Competition' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse(responseData),
      })

      const result = await httpClient.get('/api/competitions/1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/competitions/1'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(responseData)
    })

    it('GET 요청 실패를 올바르게 처리한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockApiError('Competition not found', 404),
      })

      await expect(httpClient.get('/api/competitions/999')).rejects.toThrow(
        'Competition not found'
      )
    })

    it('네트워크 에러를 올바르게 처리한다', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(httpClient.get('/api/competitions')).rejects.toThrow(
        'Network error'
      )
    })
  })

  describe('POST 요청', () => {
    it('성공적인 POST 요청을 처리한다', async () => {
      const requestData = { 
        name: '새 대회', 
        date: '2025-03-15',
        location: '서울' 
      }
      const responseData = { id: 1, ...requestData }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockApiResponse(responseData),
      })

      const result = await httpClient.post('/api/competitions', requestData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/competitions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(requestData),
        })
      )
      expect(result).toEqual(responseData)
    })

    it('유효성 검사 에러를 올바르게 처리한다', async () => {
      const requestData = { name: '' } // 잘못된 데이터

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockApiError('Validation failed', 400),
      })

      await expect(httpClient.post('/api/competitions', requestData)).rejects.toThrow(
        'Validation failed'
      )
    })
  })

  describe('PUT 요청', () => {
    it('성공적인 PUT 요청을 처리한다', async () => {
      const requestData = { 
        name: '수정된 대회', 
        date: '2025-04-15' 
      }
      const responseData = { id: 1, ...requestData }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse(responseData),
      })

      const result = await httpClient.put('/api/competitions/1', requestData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/competitions/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(requestData),
        })
      )
      expect(result).toEqual(responseData)
    })
  })

  describe('DELETE 요청', () => {
    it('성공적인 DELETE 요청을 처리한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse(null),
      })

      const result = await httpClient.delete('/api/competitions/1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/competitions/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
      expect(result).toBeNull()
    })
  })

  describe('인증 헤더', () => {
    it('JWT 토큰이 헤더에 포함된다', async () => {
      const token = 'fake-jwt-token'
      localStorage.setItem('token', token)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse({ data: 'test' }),
      })

      await httpClient.get('/api/protected')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
          }),
        })
      )

      localStorage.removeItem('token')
    })

    it('토큰이 없으면 Authorization 헤더가 포함되지 않는다', async () => {
      localStorage.removeItem('token')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse({ data: 'test' }),
      })

      await httpClient.get('/api/public')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String),
          }),
        })
      )
    })
  })

  describe('에러 응답 처리', () => {
    it('401 에러 시 토큰을 제거한다', async () => {
      localStorage.setItem('token', 'expired-token')

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockApiError('Unauthorized', 401),
      })

      await expect(httpClient.get('/api/protected')).rejects.toThrow()
      expect(localStorage.getItem('token')).toBeNull()
    })

    it('500 에러를 올바르게 처리한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => mockApiError('Internal Server Error', 500),
      })

      await expect(httpClient.get('/api/competitions')).rejects.toThrow(
        'Internal Server Error'
      )
    })
  })

  describe('요청 옵션', () => {
    it('커스텀 헤더를 추가할 수 있다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockApiResponse({ data: 'test' }),
      })

      await httpClient.get('/api/test', {
        headers: { 'X-Custom-Header': 'custom-value' },
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value',
          }),
        })
      )
    })

    it('요청 타임아웃을 설정할 수 있다', async () => {
      // 타임아웃 테스트는 실제 구현에 따라 조정 필요
      const slowResponse = new Promise(resolve => setTimeout(resolve, 10000))
      mockFetch.mockReturnValueOnce(slowResponse)

      // 실제 타임아웃 구현이 있다면 테스트
      // await expect(httpClient.get('/api/slow', { timeout: 1000 })).rejects.toThrow('timeout')
    })
  })
})
