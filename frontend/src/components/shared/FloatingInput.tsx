import { forwardRef, InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endAdornment?: React.ReactNode;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, endAdornment, id, className, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    const floated = focused || hasValue;

    return (
      <div>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            className={cn(
              "peer h-14 w-full rounded-xl border bg-glass-bg px-4 pt-4 text-sm text-text-primary outline-none transition-colors placeholder:text-transparent",
              error ? "border-danger/50 focus:border-danger" : "border-glass-border focus:border-brand-primary",
              endAdornment && "pr-10",
              className
            )}
            placeholder={label}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(!!e.target.value);
              onBlur?.(e);
            }}
            {...props}
          />
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute left-4 origin-left text-text-secondary transition-all duration-150",
              floated ? "top-2.5 text-[11px]" : "top-1/2 -translate-y-1/2 text-sm"
            )}
          >
            {label}
          </label>
          {endAdornment && <div className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</div>}
        </div>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";
