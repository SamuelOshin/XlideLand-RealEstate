import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 'heading' | 'body' | 'caption' | 'label' | 'muted' | 'subtle';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const Typography: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'p',
  variant = 'body',
  size = 'base',
  weight = 'normal',
}) => {
  const variantClasses = {
    heading: 'text-text-primary',
    body: 'text-text-secondary', 
    caption: 'text-text-muted',
    label: 'text-text-muted',
    muted: 'text-text-subtle',
    subtle: 'text-text-subtle',
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm', 
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Component 
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
    >
      {children}
    </Component>
  );
};

// Specific typography components for common use cases
export const Heading: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="heading" weight="semibold" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" size="sm" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label" weight="medium" {...props} />
);

export const Muted: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="muted" {...props} />
);

export default Typography;
