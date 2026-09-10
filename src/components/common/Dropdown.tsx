import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useDropdownPositioning } from '../../hooks/useDropdownPositioning';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  id?: string;
  label?: string;
  options?: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  trigger?: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
  children?: React.ReactNode | ((helpers: { close: () => void; isOpen: boolean }) => React.ReactNode);
  align?: 'left' | 'right';
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minWidth?: string;
  fullWidth?: boolean;
  zIndex?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select option',
  trigger,
  children,
  align = 'left',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  minWidth,
  fullWidth,
  zIndex = 100,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const isFullWidth = fullWidth || className.includes('w-full') || className.includes('flex-1');

  const setIsOpen = useCallback((open: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(open);
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  }, [isControlled, onOpenChange]);

  const uniqueId = id || `fp-dropdown-${Math.random().toString(36).substring(2, 9)}`;

  // Viewport bounds detection and auto-repositioning via useDropdownPositioning hook
  const placement = useDropdownPositioning({
    triggerRef: buttonRef,
    containerRef,
    menuRef,
    isOpen,
    preferredHorizontal: align === 'right' ? 'right' : 'left',
    targetWidth: isFullWidth ? 'match-trigger' : undefined,
  });

  // Close when another dropdown opens
  useEffect(() => {
    const handleCloseOthers = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail && customEvent.detail.id !== uniqueId) {
        setIsOpen(false);
      }
    };

    window.addEventListener('farmpot:close-dropdowns', handleCloseOthers);
    return () => {
      window.removeEventListener('farmpot:close-dropdowns', handleCloseOthers);
    };
  }, [uniqueId, setIsOpen]);

  // Click outside and Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTypingInInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (options && options.length > 0) {
        if (e.key === 'ArrowDown') {
          if (!isTypingInInput) {
            e.preventDefault();
            setHighlightedIndex(prev => {
              const nextIndex = prev < options.length - 1 ? prev + 1 : 0;
              const el = menuRef.current?.querySelector(`[data-index="${nextIndex}"]`);
              el?.scrollIntoView({ block: 'nearest' });
              return nextIndex;
            });
          }
        } else if (e.key === 'ArrowUp') {
          if (!isTypingInInput) {
            e.preventDefault();
            setHighlightedIndex(prev => {
              const nextIndex = prev > 0 ? prev - 1 : options.length - 1;
              const el = menuRef.current?.querySelector(`[data-index="${nextIndex}"]`);
              el?.scrollIntoView({ block: 'nearest' });
              return nextIndex;
            });
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          if (!isTypingInInput && highlightedIndex >= 0 && highlightedIndex < options.length) {
            e.preventDefault();
            const selectedOpt = options[highlightedIndex];
            if (selectedOpt && !selectedOpt.disabled) {
              onChange?.(selectedOpt.value);
              setIsOpen(false);
              buttonRef.current?.focus();
            }
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setIsOpen, options, highlightedIndex, onChange]);

  const toggleDropdown = () => {
    if (disabled) return;
    const nextState = !isOpen;
    if (nextState) {
      // Broadcast to close any other open dropdowns
      window.dispatchEvent(
        new CustomEvent('farmpot:close-dropdowns', { detail: { id: uniqueId } })
      );
      // Reset highlighted index to current value or 0
      if (options && options.length > 0) {
        const currentIndex = options.findIndex(
          opt => opt.value === value || (value !== undefined && value !== null && String(opt.value) === String(value))
        );
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    }
    setIsOpen(nextState);
  };

  const handleSelectOption = (optValue: string, isOptDisabled?: boolean) => {
    if (isOptDisabled) return;
    onChange?.(optValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const selectedOption = options?.find(
    opt => opt.value === value || (value !== undefined && value !== null && String(opt.value) === String(value))
  );

  return (
    <div
      ref={containerRef}
      id={`${uniqueId}-wrapper`}
      className={`relative ${isOpen ? 'z-dropdown-wrapper z-[90]' : 'z-auto'} ${isFullWidth ? 'block w-full' : 'inline-block'} text-left ${className}`}
      style={isOpen ? { zIndex: Math.max(90, zIndex - 5) } : undefined}
    >
      {label && (
        <label
          htmlFor={uniqueId}
          className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      {trigger ? (
        <div
          ref={buttonRef as any}
          id={uniqueId}
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isOpen}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
              e.preventDefault();
              toggleDropdown();
            }
          }}
          className={disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        >
          {typeof trigger === 'function' ? trigger(isOpen) : trigger}
        </div>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          id={uniqueId}
          onClick={toggleDropdown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer select-none ${
            isFullWidth ? 'w-full' : ''
          } ${
            isOpen
              ? 'border-[#334E1B] ring-2 ring-[#334E1B]/20 bg-white text-[#1F1F1F]'
              : 'border-slate-200 bg-white text-[#1F1F1F] hover:border-slate-300 hover:bg-slate-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonClassName}`}
          style={minWidth ? { minWidth } : undefined}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption?.icon}
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#334E1B]' : ''
            }`}
          />
        </button>
      )}

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div
          ref={menuRef}
          id={`${uniqueId}-menu`}
          role={options ? 'listbox' : 'menu'}
          aria-labelledby={uniqueId}
          className={`absolute bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col duration-100 z-dropdown z-[100] ${
            placement.vertical === 'top'
              ? 'bottom-full mb-1.5 animate-in fade-in zoom-in-95 slide-in-from-bottom-1'
              : 'top-full mt-1.5 animate-in fade-in zoom-in-95 slide-in-from-top-1'
          } ${
            placement.horizontal === 'right' ? 'right-0' : 'left-0'
          } ${isFullWidth && !menuClassName.includes('w-') ? 'w-full' : ''} ${menuClassName}`}
          style={{
            minWidth: minWidth ? minWidth : isFullWidth ? '100%' : '10rem',
            maxHeight: `${placement.maxHeight}px`,
            maxWidth: `${placement.maxWidth}px`,
            transform: placement.shiftX ? `translateX(${placement.shiftX}px)` : undefined,
            zIndex,
          }}
        >
          {children ? (
            <div
              className="overflow-y-auto flex-1 overscroll-contain"
              style={{ maxHeight: `${placement.maxHeight}px` }}
            >
              {typeof children === 'function'
                ? children({ close: () => setIsOpen(false), isOpen })
                : children}
            </div>
          ) : options && options.length > 0 ? (
            <div
              className="py-1.5 overflow-y-auto divide-y divide-slate-50 flex-1 overscroll-contain"
              style={{ maxHeight: `${Math.max(100, placement.maxHeight - 8)}px` }}
            >
              {options.map((opt, index) => {
                const isSelected =
                  opt.value === value ||
                  (value !== undefined && value !== null && String(opt.value) === String(value));
                const isHighlighted = highlightedIndex === index;

                return (
                  <button
                    key={opt.value}
                    data-index={index}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelectOption(opt.value, opt.disabled)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#EDFFE0] text-[#334E1B] font-bold'
                        : isHighlighted
                        ? 'bg-slate-50 text-[#1F1F1F]'
                        : 'text-slate-700 hover:bg-slate-50'
                    } ${opt.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#334E1B] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-slate-400 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};
