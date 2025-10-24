import * as React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground',
      green: 'border-transparent bg-green-500/20 text-green-300',
      yellow: 'border-transparent bg-yellow-500/20 text-yellow-300',
      red: 'border-transparent bg-red-500/20 text-red-300',
      gray: 'border-transparent bg-gray-500/20 text-gray-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants['variants']['variant'];
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants.base, badgeVariants.variants.variant[variant || 'default'], className)} {...props} />
  );
}

export { Badge };
