'use client';

import { useState, useEffect } from 'react';

import { useUploadProductDescriptionImage } from '@/hooks/admin/useAdminProduct';

interface CkEditorFieldProps {
  onChangeAction: (value: string) => void;
  placeholder?: string;
  value: string;
}

type UploadDescriptionImage = (file: File) => Promise<string>;

class ProductDescriptionUploadAdapter {
  private loader: any;
  private uploadImage: UploadDescriptionImage;

  constructor(loader: any, uploadImage: UploadDescriptionImage) {
    this.loader = loader;
    this.uploadImage = uploadImage;
  }

  public async upload() {
    const file = await this.loader.file;
    const url = await this.uploadImage(file);

    return { default: url };
  }

  public abort() {
    return;
  }
}

function createUploadAdapterPlugin(uploadImage: UploadDescriptionImage) {
  return function ProductDescriptionUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new ProductDescriptionUploadAdapter(loader, uploadImage);
    };
  };
}

export default function CkEditorField({
  onChangeAction,
  placeholder = 'Mô tả chi tiết về sản phẩm...',
  value,
}: CkEditorFieldProps) {
  const [EditorComponent, setEditorComponent] = useState<any>(null);
  const [EditorBuild, setEditorBuild] = useState<any>(null);
  const [EditorPlugins, setEditorPlugins] = useState<any[]>([]);
  const uploadProductDescriptionImage = useUploadProductDescriptionImage();

  useEffect(() => {
    let isMounted = true;

    const loadEditor = async () => {
      const [{ CKEditor }, editorModule] = await Promise.all([
        import('@ckeditor/ckeditor5-react'),
        import('ckeditor5'),
      ]);

      if (!isMounted) {
        return;
      }

      setEditorComponent(() => CKEditor);
      setEditorBuild(() => editorModule.ClassicEditor);
      setEditorPlugins([
        editorModule.Alignment,
        editorModule.Autoformat,
        editorModule.BlockQuote,
        editorModule.Bold,
        editorModule.Essentials,
        editorModule.Heading,
        editorModule.Image,
        editorModule.ImageCaption,
        editorModule.ImageResize,
        editorModule.ImageStyle,
        editorModule.ImageToolbar,
        editorModule.ImageUpload,
        editorModule.Italic,
        editorModule.Link,
        editorModule.List,
        editorModule.Paragraph,
        editorModule.PasteFromOffice,
        editorModule.Table,
        editorModule.TableToolbar,
        editorModule.Underline,
      ]);
    };

    loadEditor();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!EditorComponent || !EditorBuild || EditorPlugins.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-4">
        <div className="h-[16rem] w-full rounded-md bg-muted" />
      </div>
    );
  }

  const uploadImage = async (file: File) => {
    const response = await uploadProductDescriptionImage.trigger(file);
    const path = response?.data?.path;
    const apiBaseUrl = process.env.BASE_API_URL?.replace(/\/+$/, '');

    if (!path || !apiBaseUrl) {
      throw new Error('Không thể xác định URL ảnh đã tải lên.');
    }

    return `${apiBaseUrl}${path}`;
  };

  return (
    <div className="ck-editor-product rounded-lg border border-border bg-white">
      <EditorComponent
        config={{
          extraPlugins: [createUploadAdapterPlugin(uploadImage)],
          image: {
            resizeOptions: [
              {
                label: 'Kích thước gốc',
                name: 'resizeImage:original',
                value: null,
              },
              {
                label: '75%',
                name: 'resizeImage:75',
                value: '75',
              },
              {
                label: '50%',
                name: 'resizeImage:50',
                value: '50',
              },
            ],
            toolbar: [
              'imageTextAlternative',
              'toggleImageCaption',
              '|',
              'imageStyle:alignLeft',
              'imageStyle:alignCenter',
              'imageStyle:alignRight',
              'imageStyle:side',
              '|',
              'resizeImage',
            ],
          },
          licenseKey: 'GPL',
          placeholder,
          plugins: EditorPlugins,
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'link',
              '|',
              'alignment',
              '|',
              'bulletedList',
              'numberedList',
              '|',
              'blockQuote',
              'insertTable',
              'uploadImage',
            ],
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
