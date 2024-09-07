import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const cardVariants = cva(
  'rounded-lg !border shadow-sm mb-4 last:mb-0',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground ',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background',
        secondary: 'bg-secondary text-secondary-foreground',
        primary: 'bg-primary text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type CardVariants = VariantProps<typeof cardVariants>
