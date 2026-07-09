import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/cards/GlassCard";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { useUploadResume } from "@/hooks/queries/useUploadResume";
import { useAnalyzeResume } from "@/hooks/queries/useAnalyzeResume";
import { extractErrorMessage } from "@/services/api";
import { formatFileSize } from "@/utils/format";

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = useUploadResume();
  const analyzeMutation = useAnalyzeResume();

  const isBusy = uploadMutation.isPending || analyzeMutation.isPending;

  async function handleAnalyze() {
    if (!file) return;
    try {
      const { resumeId, preview } = await uploadMutation.mutateAsync(file);

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

      const result = await analyzeMutation.mutateAsync({ resumeId, resumeText });
      toast.success("Analysis complete");
      navigate(`/dashboard/analysis?id=${result.analysisId}`, { state: { result } });
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Upload your resume</h1>
      <p className="mt-1 text-sm text-text-secondary">
        PDF or DOCX, up to 10 MB. We only use this to generate your analysis.
      </p>

      <GlassCard hover={false} className="mt-6">
        {!file ? (
          <FileDropzone
            onFileAccepted={setFile}
            onFileRejected={() => toast.error("Only PDF or DOCX files under 10 MB are supported")}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between rounded-xl border border-glass-border bg-glass-bg p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-medium text-text-primary">{file.name}</div>
                  <div className="text-xs text-text-secondary">{formatFileSize(file.size)}</div>
                </div>
              </div>
              {!isBusy && (
                <button onClick={() => setFile(null)} className="text-text-secondary hover:text-danger" aria-label="Remove file">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              className="mt-5 w-full bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90"
              onClick={handleAnalyze}
              disabled={isBusy}
            >
              {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {uploadMutation.isPending && "Uploading resume"}
              {analyzeMutation.isPending && "Running AI analysis"}
              {!isBusy && "Analyze resume"}
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
