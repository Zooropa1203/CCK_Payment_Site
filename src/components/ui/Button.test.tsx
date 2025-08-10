import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/utils'
import { Button } from '../Button'

describe('Button 컴포넌트', () => {
  it('기본 버튼이 올바르게 렌더링된다', () => {
    render(<Button>클릭하세요</Button>)
    
    const button = screen.getByRole('button', { name: '클릭하세요' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('btn', 'btn-primary')
  })

  it('다양한 variant가 적용된다', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-secondary')

    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-danger')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-outline')
  })

  it('다양한 size가 적용된다', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-sm')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-lg')
  })

  it('disabled 상태가 올바르게 작동한다', () => {
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('btn-disabled')
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('loading 상태가 올바르게 표시된다', () => {
    render(<Button loading>Loading Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('btn-loading')
    
    // 로딩 스피너가 표시되는지 확인
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('fullWidth 옵션이 올바르게 적용된다', () => {
    render(<Button fullWidth>Full Width Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-full')
  })

  it('클릭 이벤트가 올바르게 처리된다', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('커스텀 className이 추가된다', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class', 'btn', 'btn-primary')
  })

  it('접근성 속성이 올바르게 설정된다', () => {
    render(
      <Button 
        aria-label="테스트 버튼"
        aria-describedby="button-help"
        type="submit"
      >
        Submit
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', '테스트 버튼')
    expect(button).toHaveAttribute('aria-describedby', 'button-help')
    expect(button).toHaveAttribute('type', 'submit')
  })
})
