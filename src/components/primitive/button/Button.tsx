import { forwardRef, PropsWithChildren } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: string;
  size?: string;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = 'primary', size = 'md', className = '', ...rest } = props;

  return (
    <button ref={ref} className={`inline-flex items-center justify-center rounded-md ${className}`} {...rest}>
      {props.children}
    </button>
  );
});
