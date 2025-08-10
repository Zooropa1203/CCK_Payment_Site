import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils'
import { ToastProvider, useToast } from '../Toast'

// 테스트용 컴포넌트
const ToastTestComponent = () => {
  const { showToast } = useToast()

  return (
    <div>
      <button onClick={() => showToast('성공 메시지', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('에러 메시지', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('경고 메시지', 'warning')}>
        Show Warning
      </button>
      <button onClick={() => showToast('정보 메시지', 'info')}>
        Show Info
      </button>
    </div>
  )
}

const ToastWithProvider = () => (
  <ToastProvider>
    <ToastTestComponent />
  </ToastProvider>
)

describe('Toast 시스템', () => {
  beforeEach(() => {
    // 각 테스트 전에 타이머를 모킹
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('성공 토스트가 올바르게 표시된다', async () => {
    render(<ToastWithProvider />)
    
    const button = screen.getByText('Show Success')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('성공 메시지')).toBeInTheDocument()
    })
    
    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('toast-success')
  })

  it('에러 토스트가 올바르게 표시된다', async () => {
    render(<ToastWithProvider />)
    
    const button = screen.getByText('Show Error')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('에러 메시지')).toBeInTheDocument()
    })
    
    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('toast-error')
  })

  it('경고 토스트가 올바르게 표시된다', async () => {
    render(<ToastWithProvider />)
    
    const button = screen.getByText('Show Warning')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('경고 메시지')).toBeInTheDocument()
    })
    
    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('toast-warning')
  })

  it('정보 토스트가 올바르게 표시된다', async () => {
    render(<ToastWithProvider />)
    
    const button = screen.getByText('Show Info')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('정보 메시지')).toBeInTheDocument()
    })
    
    const toast = screen.getByRole('alert')
    expect(toast).toHaveClass('toast-info')
  })

  it('토스트 닫기 버튼이 작동한다', async () => {
    render(<ToastWithProvider />)
    
    const button = screen.getByText('Show Success')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('성공 메시지')).toBeInTheDocument()
    })
    
    const closeButton = screen.getByRole('button', { name: /닫기/i })
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('성공 메시지')).not.toBeInTheDocument()
    })
  })

  it('토스트가 자동으로 사라진다', async () => {
    render(<ToastWithProvider />)
    
    const button = screen.getByText('Show Success')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('성공 메시지')).toBeInTheDocument()
    })
    
    // 5초 후 자동으로 사라지는지 확인
    vi.advanceTimersByTime(5000)
    
    await waitFor(() => {
      expect(screen.queryByText('성공 메시지')).not.toBeInTheDocument()
    })
  })

  it('여러 토스트가 동시에 표시될 수 있다', async () => {
    render(<ToastWithProvider />)
    
    const successButton = screen.getByText('Show Success')
    const errorButton = screen.getByText('Show Error')
    
    fireEvent.click(successButton)
    fireEvent.click(errorButton)
    
    await waitFor(() => {
      expect(screen.getByText('성공 메시지')).toBeInTheDocument()
      expect(screen.getByText('에러 메시지')).toBeInTheDocument()
    })
    
    const toasts = screen.getAllByRole('alert')
    expect(toasts).toHaveLength(2)
  })

  it('토스트에 적절한 아이콘이 표시된다', async () => {
    render(<ToastWithProvider />)
    
    const button = screen.getByText('Show Success')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('성공 메시지')).toBeInTheDocument()
    })
    
    // 성공 아이콘이 표시되는지 확인 (실제 아이콘 구현에 따라 조정 필요)
    const toast = screen.getByRole('alert')
    expect(toast.querySelector('.toast-icon')).toBeInTheDocument()
  })
})
