import { useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, Link, List, ListOrdered, Heading2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
  minHeight = '120px',
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);
  const isFocused = useRef(false);

  // Sync value into editor only when not focused (i.e. external changes)
  useEffect(() => {
    if (!isFocused.current && editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const emitChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (!isComposing.current) {
      emitChange();
    }
  }, [emitChange]);

  const execCmd = (command: string, val?: string) => {
    document.execCommand(command, false, val ?? undefined);
    editorRef.current?.focus();
    emitChange();
  };

  const handleAddLink = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    const url = window.prompt('Enter URL (include https://):', 'https://');
    if (url && url !== 'https://') {
      if (selectedText) {
        execCmd('createLink', url);
      } else {
        // Insert a new link with placeholder text
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
        emitChange();
      }
      // Ensure all links open in new tab
      editorRef.current?.querySelectorAll('a').forEach((a) => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      });
      emitChange();
    }
  };

  const ToolbarBtn = ({
    onClick,
    title,
    children,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onMouseDown={(e) => {
        e.preventDefault(); // Keep editor focus
        onClick();
      }}
      title={title}
      className="h-7 w-7 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className={cn('border rounded-md overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b bg-muted/30">
        <ToolbarBtn onClick={() => execCmd('bold')} title="Bold (Ctrl+B)">
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => execCmd('italic')} title="Italic (Ctrl+I)">
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => execCmd('underline')} title="Underline (Ctrl+U)">
          <Underline className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px bg-border mx-1 self-stretch" />

        <ToolbarBtn onClick={() => execCmd('formatBlock', 'h2')} title="Heading">
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => execCmd('insertUnorderedList')} title="Bullet List">
          <List className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => execCmd('insertOrderedList')} title="Numbered List">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px bg-border mx-1 self-stretch" />

        <ToolbarBtn onClick={handleAddLink} title="Insert Link">
          <Link className="w-3.5 h-3.5" />
        </ToolbarBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => { isFocused.current = true; }}
        onBlur={() => { isFocused.current = false; emitChange(); }}
        onInput={handleInput}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={cn(
          'p-3 text-sm focus:outline-none',
          'prose prose-sm max-w-none',
          '[&_a]:text-primary [&_a]:underline [&_a]:cursor-pointer',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2',
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2',
          '[&_h2]:font-semibold [&_h2]:text-base [&_h2]:mt-3 [&_h2]:mb-1',
          '[&_p]:my-1',
          // Placeholder
          'empty:before:content-[attr(data-placeholder)]',
          'empty:before:text-muted-foreground',
          'empty:before:pointer-events-none',
        )}
      />
    </div>
  );
};
