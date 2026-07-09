import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { FileText, Sparkles, UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { uploadResumeRequest, analyzeResumeRequest } from "../services/resume.service";
import { extractErrorMessage } from "../services/api";

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};
const MAX_SIZE = 10 * 1024 * 1024;

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<"idle" | "uploading" | "analyzing">("idle");

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    if (rejected.length) {
      toast.error("Only PDF or DOCX files under 10 MB are supported");
      return;
    }
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  async function handleAnalyze() {
    if (!file) return;
    try {
      setStage("uploading");
      const { resumeId, preview } = await uploadResumeRequest(file);

      setStage("analyzing");
      const resumeText = [
        preview.name,
        preview.email,
        preview.phone,
        ...preview.skills,
        ...preview.education,
        ...preview.experience,
        ...preview.projects,
        ...preview.certifications,
      ]
        .filter(Boolean)
        .join("\n");

      const result = await analyzeResumeRequest(resumeId, resumeText);
      toast.success("Analysis complete");
      navigate(`/dashboard/analysis?id=${result.analysisId}`, { state: { result } });
    } catch (error) {
      toast.error(extractErrorMessage(error));
      setStage("idle");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Upload your resume</h1>
      <p className="mt-1 text-sm text-muted">PDF or DOCX, up to 10 MB. We only use this to generate your analysis.</p>

      <Card className="mt-6">
        {!file ? (
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-16 text-center transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-medium text-ink">
              {isDragActive ? "Drop your resume here" : "Drag and drop your resume, or click to browse"}
            </p>
            <p className="mt-1 text-xs text-muted">Supported: PDF, DOCX &middot; Max size: 10 MB</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-medium text-ink">{file.name}</div>
                  <div className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              {stage === "idle" && (
                <button onClick={() => setFile(null)} className="text-muted hover:text-danger" aria-label="Remove file">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              className="mt-5 w-full"
              onClick={handleAnalyze}
              isLoading={stage !== "idle"}
              disabled={stage !== "idle"}
            >
              <Sparkles className="h-4 w-4" />
              {stage === "uploading" && "Uploading resume"}
              {stage === "analyzing" && "Running AI analysis"}
              {stage === "idle" && "Analyze resume"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
