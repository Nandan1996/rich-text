import { useState, useRef, useCallback, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ResizablePanelProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

export function ResizablePanel({
  leftPanel,
  rightPanel,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80
}: ResizablePanelProps) {
  const [leftWidth, setLeftWidth] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

    // Clamp the width within min and max bounds
    const clampedWidth = Math.min(Math.max(newLeftWidth, minSize), maxSize);
    setLeftWidth(clampedWidth);
  }, [isDragging, minSize, maxSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {/* Left Panel */}
      <div
        className="h-full overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className={cn(
          "group relative w-1 bg-border hover:bg-primary transition-all duration-200 cursor-col-resize flex-shrink-0",
          isDragging && "bg-primary"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -inset-x-1 flex items-center justify-center">
          <div className={cn(
            "w-1 h-8 bg-muted-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isDragging && "opacity-100"
          )} />
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="h-full overflow-hidden"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
}