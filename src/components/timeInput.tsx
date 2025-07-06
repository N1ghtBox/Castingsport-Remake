import { cn } from '@/lib/utils';
import { ControllerRenderProps } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

type TimeInputProps = {
    value: string
    className?: string;
    onChange: (value: string) => void
}

export default function TimeInput({ value, onChange, className, ...props }: TimeInputProps & ControllerRenderProps) {

    const validate = (val: string) => {
        const regex = /^\d\.[0-5]\d\.[0-9]\d$/;
        return regex.test(val);
    };

    return (
        <IMaskInput
            {...props}
            mask="0.50.00"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            value={value}
            overwrite
            definitions={{
                '0': /[0-9]/,
                '5': /[0-5]/,
            }}
            onComplete={(val) => {
                if (!validate(val)) {
                    console.warn('Invalid input:', val);
                } else {
                    onChange(val)
                }
            }}
        />
    )
}