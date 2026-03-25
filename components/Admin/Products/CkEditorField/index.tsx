'use client';

import { useState, useEffect } from 'react';

interface CkEditorFieldProps {
  onChangeAction: (value: string) => void;
  placeholder?: string;
  value: string;
}

class Base64UploadAdapter {
  private loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  public upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise<{ default: string }>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve({ default: reader.result as string });
          };

          reader.onerror = () => {
            reject(new Error('Không thể tải ảnh lên.'));
          };

          reader.readAsDataURL(file);
        }),
    );
  }

  public abort() {
    return;
  }
}

function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new Base64UploadAdapter(loader);
  };
}

export default function CkEditorField({
  onChangeAction,
  placeholder = 'Mô tả chi tiết về sản phẩm...',
  value,
}: CkEditorFieldProps) {
  const [EditorComponent, setEditorComponent] = useState<any>(null);
  const [EditorBuild, setEditorBuild] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEditor = async () => {
      const [{ CKEditor }, classicEditorModule] = await Promise.all([
        import('@ckeditor/ckeditor5-react'),
        import('@ckeditor/ckeditor5-build-classic'),
      ]);

      if (!isMounted) {
        return;
      }

      setEditorComponent(() => CKEditor);
      setEditorBuild(() => (classicEditorModule as any).default);
    };

    loadEditor();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!EditorComponent || !EditorBuild) {
    return (
      <div className="rounded-lg border border-border bg-white p-4">
        <div className="h-[16rem] w-full rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="ck-editor-product rounded-lg border border-border bg-white">
      <EditorComponent
        config={{
          extraPlugins: [CustomUploadAdapterPlugin],
          image: {
            toolbar: [
              'imageTextAlternative',
              '|',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
            ],
          },
          licenseKey: 'GPL',
          placeholder,
          toolbar: {
            shouldNotGroupWhenFull: true,
          },
        }}
        data={value}
        editor={EditorBuild}
        onChange={(_event: unknown, editor: { getData: () => string }) => {
          onChangeAction(editor.getData());
        }}
      />

      <style>{`
        .ck-editor-product .ck-editor__editable_inline {
          min-height: 18rem;
          max-height: 30rem;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
