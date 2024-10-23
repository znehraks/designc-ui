// src/components/primitive/button/button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies default classes correctly', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    // buttonVariants의 기본 클래스들이 적용되어 있는지 확인
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-md');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11', 'px-8');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges custom className with default classes', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
    // 기본 클래스들도 유지되어야 함
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });
});
