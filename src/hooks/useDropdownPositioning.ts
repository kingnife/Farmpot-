import { useState, useEffect, useCallback, RefObject, CSSProperties } from 'react';

export type VerticalAnchor = 'bottom' | 'top';
export type HorizontalAnchor = 'left' | 'right' | 'center';

export interface UseDropdownPositioningOptions {
  /** Reference to the trigger button or wrapper element */
  triggerRef: RefObject<HTMLElement | null>;
  /** Optional secondary container ref to fall back on if triggerRef is temporarily unmounted */
  containerRef?: RefObject<HTMLElement | null>;
  /** Reference to the floating menu dropdown element */
  menuRef: RefObject<HTMLElement | null>;
  /** Whether the dropdown menu is currently opened */
  isOpen: boolean;
  /** Preferred vertical direction to open. Defaults to 'bottom' */
  preferredVertical?: VerticalAnchor | 'auto';
  /** Preferred horizontal alignment. Defaults to 'left' */
  preferredHorizontal?: HorizontalAnchor | 'auto';
  /** Safety edge margin from viewport boundaries in pixels. Defaults to 8px */
  margin?: number;
  /** Gap between the trigger and the dropdown menu in pixels. Defaults to 6px */
  offsetY?: number;
  /** Minimum allowable height for the dropdown menu in pixels. Defaults to 120px */
  minHeight?: number;
  /** Maximum allowable height for the dropdown menu in pixels. Defaults to 380px */
  maxAllowedHeight?: number;
  /** Fallback estimated width before DOM measurement. Defaults to 220px */
  fallbackWidth?: number;
  /** Fallback estimated height before DOM measurement. Defaults to 240px */
  fallbackHeight?: number;
  /** Target fixed width for menu if desired (e.g. 410px for rich menus), or 'match-trigger' */
  targetWidth?: number | 'match-trigger';
}

export interface DropdownPositionState {
  /** Active vertical anchor after viewport collision checks */
  vertical: VerticalAnchor;
  /** Active horizontal anchor after viewport collision checks */
  horizontal: HorizontalAnchor;
  /** Horizontal shift in pixels (applied via translateX) to prevent screen cutoff */
  shiftX: number;
  /** Calculated relative left position (in pixels relative to trigger) */
  relativeLeft: number;
  /** Alias for relativeLeft */
  left: number;
  /** Calculated position for top arrow pointer if present */
  arrowLeft: number;
  /** Maximum height in pixels to constrain the menu so it never extends off-screen */
  maxHeight: number;
  /** Maximum width in pixels to constrain the menu within screen boundaries */
  maxWidth: number;
  /** Calculated width in pixels (if constrained or requested) */
  width?: number;
  /** True if the dropdown flipped vertically from its preferred orientation */
  isFlippedVertical: boolean;
  /** True if the dropdown flipped horizontally from its preferred orientation */
  isFlippedHorizontal: boolean;
  /** Pre-calculated inline CSS styles ready to pass to the dropdown container */
  menuStyle: CSSProperties;
  /** Tailwind-friendly placement class helper */
  placementClasses: string;
}

/**
 * Custom hook that detects viewport boundaries (top, bottom, left, right)
 * and automatically repositions a dropdown menu vertically and horizontally
 * to keep it entirely visible on all devices (mobile, tablet, desktop) without clipping.
 */
export function useDropdownPositioning({
  triggerRef,
  containerRef,
  menuRef,
  isOpen,
  preferredVertical = 'bottom',
  preferredHorizontal = 'left',
  margin = 8,
  offsetY = 6,
  minHeight = 120,
  maxAllowedHeight = 380,
  fallbackWidth = 220,
  fallbackHeight = 240,
  targetWidth,
}: UseDropdownPositioningOptions) {
  const [position, setPosition] = useState<DropdownPositionState>(() => ({
    vertical: preferredVertical === 'top' ? 'top' : 'bottom',
    horizontal:
      preferredHorizontal === 'right'
        ? 'right'
        : preferredHorizontal === 'center'
        ? 'center'
        : 'left',
    shiftX: 0,
    relativeLeft: 0,
    left: 0,
    arrowLeft: 24,
    maxHeight: 280,
    maxWidth: typeof window !== 'undefined' ? Math.max(160, window.innerWidth - 2 * margin) : 360,
    isFlippedVertical: false,
    isFlippedHorizontal: false,
    menuStyle: {},
    placementClasses: preferredVertical === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
  }));

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') return;

    const triggerEl = triggerRef.current || containerRef?.current;
    if (!triggerEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const menuEl = menuRef.current;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Determine target width
    let resolvedMenuWidth: number;
    if (targetWidth === 'match-trigger') {
      resolvedMenuWidth = triggerRect.width;
    } else if (typeof targetWidth === 'number') {
      resolvedMenuWidth = Math.min(targetWidth, viewportWidth - 2 * margin);
    } else if (menuEl && menuEl.offsetWidth > 0) {
      resolvedMenuWidth = menuEl.offsetWidth;
    } else {
      resolvedMenuWidth = fallbackWidth;
    }

    const resolvedMenuHeight =
      menuEl && menuEl.offsetHeight > 0 ? menuEl.offsetHeight : fallbackHeight;

    // 1. VERTICAL BOUNDARY DETECTION (Top & Bottom Edges)
    const spaceBelow = viewportHeight - triggerRect.bottom - margin - offsetY;
    const spaceAbove = triggerRect.top - margin - offsetY;

    let vertical: VerticalAnchor = 'bottom';
    let isFlippedVertical = false;

    if (preferredVertical === 'top') {
      // User prefers opening upwards
      if (spaceAbove >= Math.min(resolvedMenuHeight, minHeight) || spaceAbove >= spaceBelow) {
        vertical = 'top';
      } else {
        vertical = 'bottom';
        isFlippedVertical = true;
      }
    } else if (preferredVertical === 'auto') {
      // Pick direction with the greatest available height
      if (spaceBelow >= resolvedMenuHeight) {
        vertical = 'bottom';
      } else if (spaceAbove > spaceBelow) {
        vertical = 'top';
        isFlippedVertical = true;
      } else {
        vertical = 'bottom';
      }
    } else {
      // Default: preferredVertical === 'bottom'
      // Flip upwards if space below cannot accommodate the minimum required height AND space above is greater
      if (spaceBelow < Math.min(resolvedMenuHeight, 190) && spaceAbove > spaceBelow) {
        vertical = 'top';
        isFlippedVertical = true;
      } else {
        vertical = 'bottom';
      }
    }

    // Calculate maximum available height clamped between minHeight and maxAllowedHeight
    const availableVerticalSpace = vertical === 'top' ? spaceAbove : spaceBelow;
    const calculatedMaxHeight = Math.max(
      minHeight,
      Math.min(maxAllowedHeight, Math.floor(availableVerticalSpace))
    );

    // 2. HORIZONTAL BOUNDARY DETECTION (Left & Right Edges)
    const calculatedMaxWidth = Math.max(160, viewportWidth - 2 * margin);
    let horizontal: HorizontalAnchor =
      preferredHorizontal === 'right'
        ? 'right'
        : preferredHorizontal === 'center'
        ? 'center'
        : 'left';
    let isFlippedHorizontal = false;
    let shiftX = 0;
    let relativeLeft = 0;
    const triggerCenterScreen = triggerRect.left + triggerRect.width / 2;

    if (preferredHorizontal === 'center') {
      // Centered anchor relative to the trigger
      let idealLeftScreen = triggerCenterScreen - resolvedMenuWidth / 2;

      // Viewport collision checks: clamp within [margin, viewportWidth - margin]
      if (idealLeftScreen + resolvedMenuWidth > viewportWidth - margin) {
        idealLeftScreen = viewportWidth - margin - resolvedMenuWidth;
        isFlippedHorizontal = true;
      }
      if (idealLeftScreen < margin) {
        idealLeftScreen = margin;
        isFlippedHorizontal = true;
      }

      relativeLeft = idealLeftScreen - triggerRect.left;
    } else if (preferredHorizontal === 'right') {
      // Right-aligned to trigger edge
      const expectedLeft = triggerRect.right - resolvedMenuWidth;

      if (expectedLeft < margin) {
        // Left boundary violation: test if opening left-aligned fits without collision
        const expectedRightIfLeft = triggerRect.left + resolvedMenuWidth;
        if (expectedRightIfLeft <= viewportWidth - margin) {
          horizontal = 'left';
          isFlippedHorizontal = true;
        } else {
          // Screen is narrower than menu or center-pinched: calculate horizontal shift
          shiftX = margin - expectedLeft;
          if (triggerRect.right + shiftX > viewportWidth - margin) {
            shiftX = viewportWidth - margin - triggerRect.right;
          }
        }
      }
    } else {
      // Default: preferredHorizontal === 'left' (Left-aligned to trigger edge)
      const expectedRight = triggerRect.left + resolvedMenuWidth;

      if (expectedRight > viewportWidth - margin) {
        // Right boundary violation: test if opening right-aligned fits without collision
        const expectedLeftIfRight = triggerRect.right - resolvedMenuWidth;
        if (expectedLeftIfRight >= margin) {
          horizontal = 'right';
          isFlippedHorizontal = true;
        } else {
          // Screen is narrower than menu: calculate horizontal shift to stay within viewport
          shiftX = viewportWidth - margin - expectedRight;
          if (triggerRect.left + shiftX < margin) {
            shiftX = margin - triggerRect.left;
          }
        }
      }
    }

    // Calculate pointer arrow position so it precisely tracks trigger center
    let arrowLeft = 24;
    if (preferredHorizontal === 'center') {
      const idealLeftScreen = triggerRect.left + relativeLeft;
      arrowLeft = Math.max(
        16,
        Math.min(resolvedMenuWidth - 24, triggerCenterScreen - idealLeftScreen)
      );
    } else if (horizontal === 'right') {
      arrowLeft = Math.max(16, resolvedMenuWidth - triggerRect.width / 2);
    } else {
      arrowLeft = Math.max(16, triggerRect.width / 2);
    }

    // Placement helper classes
    const placementClasses = `${
      vertical === 'top'
        ? 'bottom-full mb-1.5 animate-in fade-in zoom-in-95 slide-in-from-bottom-1'
        : 'top-full mt-1.5 animate-in fade-in zoom-in-95 slide-in-from-top-1'
    } ${horizontal === 'right' ? 'right-0' : horizontal === 'center' ? '' : 'left-0'}`;

    // Build pre-computed menu style
    const menuStyle: CSSProperties = {
      maxHeight: `${calculatedMaxHeight}px`,
      maxWidth: `${calculatedMaxWidth}px`,
    };

    if (preferredHorizontal === 'center') {
      menuStyle.left = `${relativeLeft}px`;
    } else if (shiftX !== 0) {
      menuStyle.transform = `translateX(${shiftX}px)`;
    }

    if (typeof targetWidth === 'number') {
      menuStyle.width = `${resolvedMenuWidth}px`;
    } else if (targetWidth === 'match-trigger') {
      menuStyle.width = `${resolvedMenuWidth}px`;
    }

    setPosition({
      vertical,
      horizontal,
      shiftX,
      relativeLeft,
      left: relativeLeft,
      arrowLeft,
      maxHeight: calculatedMaxHeight,
      maxWidth: calculatedMaxWidth,
      width: resolvedMenuWidth,
      isFlippedVertical,
      isFlippedHorizontal,
      menuStyle,
      placementClasses,
    });
  }, [
    triggerRef,
    containerRef,
    menuRef,
    preferredVertical,
    preferredHorizontal,
    margin,
    offsetY,
    minHeight,
    maxAllowedHeight,
    fallbackWidth,
    fallbackHeight,
    targetWidth,
  ]);

  // Recalculate on open, window resize, and scroll (including inside nested modal scroll containers)
  useEffect(() => {
    if (!isOpen) return;

    // Immediately trigger calculation
    updatePosition();

    // Use requestAnimationFrame to measure after any DOM paints or transitions
    const rafId = requestAnimationFrame(updatePosition);

    const handleWindowChange = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleWindowChange, { passive: true });
    window.addEventListener('scroll', handleWindowChange, { passive: true, capture: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [isOpen, updatePosition]);

  return {
    ...position,
    updatePosition,
  };
}
