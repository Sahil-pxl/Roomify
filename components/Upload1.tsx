import { useState, type ChangeEvent, type DragEvent } from 'react';
import { useOutletContext } from "react-router";
import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
import {
  PROGRESS_INTERVAL_MS,
  PROGRESS_STEP,
  REDIRECT_DELAY_MS,
} from "../lib/constants";

interface UploadProps {
  onComplete?: (fileBase64: string) => void;
}

const Upload = ({ onComplete = () => {} }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isSignedIn } = useOutletContext<AuthContext>();

  const processFile = (incomingFile: File) => {
    const fileReader = new FileReader();
    const fileBase64Promise = new Promise<string>((resolve, reject) => {
      fileReader.onerror = () => reject(fileReader.error);
      fileReader.onload = () => {
        const result = fileReader.result;
        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("Unable to read file as Base64"));
        }
      };
    });

    fileReader.readAsDataURL(incomingFile);

    let intervalId: number | null = null;
    intervalId = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + PROGRESS_STEP);
        if (next >= 100 && intervalId !== null) {
          window.clearInterval(intervalId);
          fileBase64Promise.then((base64) => {
            window.setTimeout(() => {
              onComplete(base64);
            }, REDIRECT_DELAY_MS);
          });
        }
        return next;
      });
    }, PROGRESS_INTERVAL_MS);
  };

  const handleFiles = (files: FileList | null) => {
    if (!isSignedIn || !files?.length) {
      return;
    }

    const selectedFile = files[0];
    setFile(selectedFile);
    setProgress(0);
    processFile(selectedFile);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleDragEnter = (event: DragEvent<HTMLUListElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isSignedIn) {
      return;
    }
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLUListElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isSignedIn) {
      return;
    }
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLUListElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLUListElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (!isSignedIn) {
      return;
    }
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="upload">
      {!file ? (
        <ul
          className={`dropzone ${isDragging ? "dragging" : ""}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-disabled={!isSignedIn}
        >
          <li className="drop-item">
            <input
              type="file"
              className="drop-input"
              accept=".jpg,.jpeg,.png,.webp"
              disabled={!isSignedIn}
              onChange={handleChange}
            />
            <div className="drop-content">
              <div className="drop-icon">
                <UploadIcon size={20} />
              </div>
              <p>
                {isSignedIn
                  ? "Click to upload or just drag and drop here"
                  : "Sign in or Sign up with puter to upload your floor plan"}
              </p>
              <p className="help">Maximum file size is 20MB</p>
            </div>
          </li>
        </ul>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>
            <h3>{file.name}</h3>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
              <p className="status-text">
                {progress < 100 ? `Analyzing... ${progress}%` : "Redirecting...."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
