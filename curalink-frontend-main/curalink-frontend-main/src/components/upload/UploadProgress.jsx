// UploadProgress — progress bar shown during PDF upload/ingestion
export default function UploadProgress({ progress }) {
  return <div className="upload-progress">{progress}%</div>;
}
