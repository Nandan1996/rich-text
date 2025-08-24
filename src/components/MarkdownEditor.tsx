import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import markdown from 'highlight.js/lib/languages/markdown';
import 'highlight.js/styles/github-dark.css';

// Register markdown language
hljs.registerLanguage('markdown', markdown);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  // Sync scrolling between textarea and highlight layer
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Update syntax highlighting when content changes
  useEffect(() => {
    if (highlightRef.current) {
      const highlighted = hljs.highlight(value, { language: 'markdown' });
      highlightRef.current.innerHTML = highlighted.value;
    }
  }, [value]);

  // Handle tab key to insert tabs instead of losing focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Restore cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-3 text-sm text-muted-foreground font-mono">
            markdown.md
          </span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Syntax Highlighting Layer with left padding for line numbers */}
        <pre
          ref={highlightRef}
          className="absolute inset-0 pl-12 pr-4 py-4 text-sm font-mono leading-relaxed text-transparent pointer-events-none overflow-auto custom-scrollbar"
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        />

        {/* Line Numbers */}
        <div className="absolute left-0 top-0 py-4 pl-2 pr-1 text-xs font-mono leading-relaxed text-muted-foreground/40 pointer-events-none select-none border-r border-border/50">
          {value.split('\n').map((_, index) => (
            <div key={index} className="text-right">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Textarea with left padding for line numbers */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          className="absolute inset-0 pl-12 pr-4 py-4 text-sm font-mono leading-relaxed bg-transparent text-foreground resize-none outline-none overflow-auto custom-scrollbar"
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            caretColor: 'hsl(var(--primary))',
          }}
          placeholder="Start typing your markdown here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}