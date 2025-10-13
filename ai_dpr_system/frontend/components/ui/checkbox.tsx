import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
	"peer h-4 w-4 shrink-0 rounded border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			checked: {
				true: "bg-primary border-primary",
				false: "bg-background border-input"
			}
		},
		defaultVariants: {
			checked: false
		}
	}
)

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	checked?: boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, checked, ...props }, ref) => {
		return (
			<input
				type="checkbox"
				className={cn(checkboxVariants({ checked }), className)}
				checked={checked}
				ref={ref}
				{...props}
			/>
		)
	}
)
Checkbox.displayName = "Checkbox"
