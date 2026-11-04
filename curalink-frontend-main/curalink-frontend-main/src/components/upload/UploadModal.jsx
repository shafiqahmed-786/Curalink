// UploadModal — drag-and-drop PDF upload modal
import { useState, useRef, useCallback, useEffect } from 'react';
import { useUpload } from '../../hooks/useUpload';
import AppIcon from '../common/AppIcon';
import styles from './UploadModal.module.css';

export default function UploadModal({ onClose, onUploaded }) {
  const { upload, uploading, progress } = useUpload();
  const [dragging, setDragging] = useState(false);
  const [file,     setFile]     = useState(null);
  const fileInputRef = useRef(null);
  const overlayRef   = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && !uploading) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, uploading]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleFile = (f) => {
    if (f?.type === 'application/pdf') setFile(f);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleUpload = async () => {
    if (!file || uploading) return;
    const result = await upload(file);
    if (result) {
      onUploaded?.(result);
      onClose();
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current && !uploading) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Upload PDF"
    >
      <div className={styles.modal}>
        {/* Close */}
        {!uploading && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}

        {/* Header */}
        <div className={styles.header}>
          <AppIcon size={36} />
          <div>
            <h2 className={styles.title}>Upload PDF</h2>
            <p className={styles.subtitle}>Patient reports, research papers, clinical notes</p>
          </div>
        </div>

        {/* Drop zone */}
        {!uploading && (
          <div
            className={`${styles.dropZone} ${dragging ? styles.dropZoneDragging : ''} ${file ? styles.dropZoneHasFile : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !file && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop PDF here or click to browse"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className={styles.fileInput}
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {file ? (
              <div className={styles.filePreview}>
                {/* PDF icon */}
                <div className={styles.pdfIcon} aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{formatSize(file.size)}</span>
                </div>
                <button
                  className={styles.removeFile}
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  aria-label="Remove file"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className={styles.dropPrompt}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p className={styles.dropText}>
                  <strong>Drop your PDF here</strong> or click to browse
                </p>
                <p className={styles.dropHint}>Max {import.meta.env.VITE_MAX_PDF_MB || 20}MB · PDF only</p>
              </div>
            )}
          </div>
        )}

        {/* Upload progress */}
        {uploading && (
          <div className={styles.progressWrap}>
            <div className={styles.progressFile}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>{file?.name}</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.progressLabels}>
              <span className={styles.progressStatus}>
                {progress < 100 ? 'Uploading…' : 'Processing & indexing…'}
              </span>
              <span className={styles.progressPct}>{progress}%</span>
            </div>
            <p className={styles.progressNote}>
              Extracting text, chunking, and embedding into the vector store. This may take a moment.
            </p>
          </div>
        )}

        {/* Actions */}
        {!uploading && (
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button
              className={`${styles.uploadBtn} ${file ? styles.uploadBtnActive : ''}`}
              onClick={handleUpload}
              disabled={!file}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload & Index
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
