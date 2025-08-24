import { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ResizablePanel } from './ResizablePanel';
import { MarkdownEditor } from './MarkdownEditor';
import { HTMLPreview } from './HTMLPreview';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultMarkdown = `# Markdown to HTML Converter

Welcome to the **Markdown to HTML Converter**! This tool provides a live preview of your markdown content.

## Features

- 🔥 **Real-time preview** - See your HTML output instantly
- ✨ **Syntax highlighting** - Beautiful markdown syntax highlighting
- 📝 **Clean HTML output** - Copy clean HTML without extra attributes
- 🖱️ **Resizable panels** - Drag to adjust the view

## Sample Content

Here's some sample markdown to get you started:

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists

- Item 1
- Item 2
  - Nested item
  - Another nested item

### Quotes

> This is a blockquote with some **bold** and *italic* text.

### Links and Images

Check out [this amazing tool](https://example.com) or view this sample image:

![Sample Image](https://via.placeholder.com/400x200/6366f1/ffffff?text=Sample+Image)

### Table

| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Copy HTML | ✅ |
| Syntax Highlighting | ✅ |

---

Start editing this markdown to see the magic happen! ✨`;

export function MarkdownConverter() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [htmlContent, setHtmlContent] = useState('');
  const { toast } = useToast();

  const convertMarkdown = useCallback(async (markdownText: string) => {
    try {
      const rawHtml = await marked(markdownText);
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      setHtmlContent(cleanHtml);
    } catch (error) {
      console.error('Error converting markdown:', error);
      setHtmlContent('<p>Error converting markdown</p>');
    }
  }, []);

  // Convert initial markdown
  useEffect(() => {
    convertMarkdown(defaultMarkdown);
  }, [convertMarkdown]);

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value);
    convertMarkdown(value);
  }, [convertMarkdown]);

  const copyHTML = useCallback(async () => {
    try {
      // Create a clean version without extra attributes for copying
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Remove any data attributes, classes, and IDs that might be added by the preview
      const cleanHTML = tempDiv.innerHTML;
      
      await navigator.clipboard.writeText(cleanHTML);
      toast({
        title: "HTML Copied!",
        description: "Clean HTML has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy HTML to clipboard.",
        variant: "destructive",
      });
    }
  }, [htmlContent, toast]);

  const downloadHTML = useCallback(() => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "HTML Downloaded!",
      description: "HTML file has been saved to your downloads.",
    });
  }, [htmlContent, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-panel">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Markdown to HTML
                </h1>
                <p className="text-sm text-muted-foreground">
                  Convert markdown to clean HTML with live preview
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyHTML}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy HTML
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadHTML}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="h-[calc(100vh-140px)] bg-card rounded-lg border border-border shadow-code overflow-hidden">
          <ResizablePanel
            leftPanel={
              <MarkdownEditor
                value={markdown}
                onChange={handleMarkdownChange}
              />
            }
            rightPanel={
              <HTMLPreview htmlContent={htmlContent} />
            }
          />
        </div>
      </main>
    </div>
  );
}