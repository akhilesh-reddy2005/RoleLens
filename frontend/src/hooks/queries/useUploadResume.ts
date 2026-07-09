import { useMutation } from "@tanstack/react-query";
import { uploadResumeRequest } from "../../services/resume.service";

export function useUploadResume() {
  return useMutation({ mutationFn: (file: File) => uploadResumeRequest(file) });
}
