import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};
const MAX_SIZE = 10 * 1024 * 1024;

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  onFileRejected: () => void;
}

export function FileDropzone({ onFileAccepted, onFileRejected }: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length) {
        onFileRejected();
        return;
      }
      if (accepted[0]) onFileAccepted(accepted[0]);
    },
    [onFileAccepted, onFileRejected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-all duration-300",
        isDragActive
          ? "border-brand-primary bg-brand-primary/5 shadow-glow-primary"
          : "border-glass-border bg-glass-bg hover:border-brand-primary/50 hover:bg-brand-primary/5"
      )}
    >
      <input {...getInputProps()} />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-mesh-bg" />
      <span
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-transform duration-300",
          isDragActive && "scale-110 animate-pulse-glow"
        )}
      >
        <UploadCloud className="h-6 w-6" />
      </span>
      <p className="relative mt-5 text-sm font-medium text-text-primary">
        {isDragActive ? "Drop your resume here" : "Drag and drop your resume, or click to browse"}
      </p>
      <p className="relative mt-1.5 text-xs text-text-secondary">Supported: PDF, DOCX &middot; Max size: 10 MB</p>
    </div>
  );
}
