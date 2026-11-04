// useUpload — handles PDF file upload with progress tracking
import { useState, useCallback } from 'react';
import { uploadPDF } from '../services/upload.service';
import { useToast } from '../context/ToastContext';

export function useUpload() {
  const [progress,  setProgress]  = useState(0);
  const [uploading, setUploading] = useState(false);
  const [result,    setResult]    = useState(null);
  const { toast } = useToast();

  const upload = useCallback(async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const res = await uploadPDF(file, (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
      setResult(res.data.data);
      toast.success(`"${file.name}" uploaded and indexed successfully.`);
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(msg);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [toast]);

  return { upload, uploading, progress, result };
}
