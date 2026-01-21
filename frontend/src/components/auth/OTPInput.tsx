import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
}

export const OTPInput = ({ value, onChange, length = 6, disabled }: OTPInputProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        if (!val) return;

        const newValue = value.split("");
        newValue[index] = val.slice(-1);
        const result = newValue.join("");
        onChange(result);

        if (index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newValue = value.split("");

            if (value[index]) {
                newValue[index] = "";
                onChange(newValue.join(""));
            } else if (index > 0) {
                newValue[index - 1] = "";
                onChange(newValue.join(""));
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
        if (pastedData) {
            onChange(pastedData);
            const nextIndex = Math.min(pastedData.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    return (
        <div className="flex gap-2 justify-between w-full" onPaste={handlePaste}>
            {Array.from({ length }).map((_, index) => (
                <input

                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    className={cn(
                        "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-transparent border-b-2 border-muted-foreground/30 focus:border-primary focus:outline-none transition-all disabled:opacity-50",
                        value[index] ? "border-primary" : "border-muted-foreground/30"
                    )}
                />
            ))}
        </div>
    );
};
