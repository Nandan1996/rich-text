import { useEffect, useRef } from 'react';

interface HTMLPreviewProps {
  htmlContent: string;
}

export function HTMLPreview({ htmlContent }: HTMLPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  // Update preview content
  useEffect(() => {
    if (previewRef.current && htmlContent) {
      previewRef.current.innerHTML = htmlContent;
    }
  }, [htmlContent]);

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-3 text-sm text-muted-foreground font-mono">
            preview.html
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div
          ref={previewRef}
          className="p-4 prose max-w-none"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {!htmlContent && (
            <div className="text-muted-foreground text-center py-8">
              Start typing markdown to see the preview...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}