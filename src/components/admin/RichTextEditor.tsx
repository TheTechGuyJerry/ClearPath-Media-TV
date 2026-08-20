import React, { useState, useRef, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { FileImage, Code, Eye, Type } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'html' | 'preview'>('visual');
  const quillRef = useRef<ReactQuill>(null);
  const [htmlError, setHtmlError] = useState<string | null>(null);

  

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      try {
        const storageRef = ref(storage, `articles/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection();
          editor.insertEmbed(range ? range.index : 0, 'image', downloadURL);
        }
      } catch (error: any) {
        alert('Image upload failed: ' + error.message);
      }
    };
  }, [storage]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote'],
        ['link', 'image'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    onChange(newHtml);
    setHtmlError(null);
  };

  const getSanitizedContent = () => {
    return DOMPurify.sanitize(value || '', {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
    });
  };

  return (
    <div className="border border-outline rounded-lg overflow-hidden bg-surface-bright flex flex-col">
      <div className="flex items-center gap-2 p-2 bg-surface-container border-b border-outline">
        <button
          type="button"
          onClick={() => setMode('visual')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${mode === 'visual' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'}`}
        >
          <Type className="w-3.5 h-3.5" /> Visual Editor
        </button>
        <button
          type="button"
          onClick={() => setMode('html')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${mode === 'html' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'}`}
        >
          <Code className="w-3.5 h-3.5" /> HTML Source
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${mode === 'preview' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface'}`}
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
      </div>

      <div className="relative flex-1 min-h-[400px]">
        {mode === 'visual' && (
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value || ''}
            onChange={(content, delta, source, editor) => {
              if (source === 'user') {
                onChange(content);
              }
            }}
            modules={modules}
            placeholder={placeholder}
            className="h-full custom-quill-container"
          />
        )}
        
        {mode === 'html' && (
          <div className="h-full flex flex-col w-full p-0 m-0">
            <textarea
              value={value || ''}
              onChange={handleHtmlChange}
              className="w-full flex-1 p-4 font-mono text-sm bg-slate-900 text-slate-100 outline-none resize-none min-h-[400px]"
              placeholder="<p>Write your HTML here...</p>"
            />
            {htmlError && (
              <div className="bg-red-100 text-red-800 p-2 text-xs font-bold">
                {htmlError}
              </div>
            )}
          </div>
        )}

        {mode === 'preview' && (
          <div className="p-6 bg-white dark:bg-surface-bright min-h-[400px] overflow-auto prose prose-slate dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: getSanitizedContent() }} />
          </div>
        )}
      </div>
      
      {/* Footer / Stats */}
      <div className="p-2 bg-surface-container text-xs text-on-surface-variant font-mono border-t border-outline flex justify-between">
        <span>{(value || '').length} characters</span>
        <span>{((value || '').match(/\S+/g) || []).length} words</span>
      </div>
    </div>
  );
}
