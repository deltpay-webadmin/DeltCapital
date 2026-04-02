import { useState } from 'react';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  label?: string;
  required?: boolean;
  type?: 'ssn' | 'ein' | 'password';
  format?: (value: string) => string;
}

export function SecureInput({
  value,
  onChange,
  placeholder = '',
  maxLength,
  className = '',
  label,
  required = false,
  type = 'password',
  format,
}: SecureInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const maskValue = (val: string): string => {
    if (!val) return '';
    
    if (type === 'ssn') {
      // Format: XXX-XX-XXXX -> ●●●-●●-●●●●
      const formatted = format ? format(val) : val;
      return formatted.replace(/\d/g, '●');
    }
    
    if (type === 'ein') {
      // Format: XX-XXXXXXX -> ●●-●●●●●●●
      const formatted = format ? format(val) : val;
      return formatted.replace(/\d/g, '●');
    }
    
    return val.replace(/./g, '●');
  };

  const handleFocus = () => {
    if (!hasInteracted) {
      setShowSecurityNotice(true);
      setHasInteracted(true);
      // Auto-hide after 4 seconds
      setTimeout(() => setShowSecurityNotice(false), 4000);
    }
  };

  const displayValue = isVisible ? (format ? format(value) : value) : maskValue(value);
  
  // Determine actual max length for digits only
  const digitMaxLength = type === 'ssn' ? 9 : type === 'ein' ? 9 : maxLength;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation and control keys
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        // Remove last digit
        onChange(value.slice(0, -1));
      }
      return;
    }

    // Only allow digits
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // Check if we've reached max length
    if (digitMaxLength && value.length >= digitMaxLength) {
      e.preventDefault();
      return;
    }

    // Add the digit
    e.preventDefault();
    onChange(value + e.key);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digits = pastedText.replace(/[^\d]/g, '');
    const limitedDigits = digits.slice(0, digitMaxLength);
    onChange(limitedDigits);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-semibold text-[#041E42] dark:text-white mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52606D]" />
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            // This handles cases where onChange is triggered without keyDown (like autofill)
            const rawValue = e.target.value.replace(/[^\d●]/g, '').replace(/●/g, '');
            const limitedValue = rawValue.slice(0, digitMaxLength);
            if (rawValue !== value) {
              onChange(limitedValue);
            }
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`${className} pl-11 pr-12`}
          autoComplete="off"
          inputMode="numeric"
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52606D] hover:text-[#1B17FF] transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#1B17FF]"
          aria-label={isVisible ? 'Hide value' : 'Show value'}
        >
          {isVisible ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Security Notice Popup */}
      <AnimatePresence>
        {showSecurityNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-50 mt-2 w-full bg-gradient-to-r from-[#1B17FF] to-[#4845FF] text-white p-4 rounded-lg shadow-xl border-2 border-[#1B17FF]"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">
                  Your information is secure
                </p>
                <p className="text-xs text-white/90 leading-relaxed">
                  This data is encrypted with bank-level 256-bit AES encryption and transmitted securely over HTTPS. We never store or share your sensitive information.
                </p>
              </div>
              <button
                onClick={() => setShowSecurityNotice(false)}
                className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                aria-label="Close notice"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
