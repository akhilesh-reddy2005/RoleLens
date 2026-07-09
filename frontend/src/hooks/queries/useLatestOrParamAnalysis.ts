import { useMemo } from "react";
import { AnalysisResult } from "../../types";
import { normalizeAnalysisDetail } from "../../utils/analysis";
import { useAnalysisDetail } from "./useAnalysisDetail";
import { useHistory } from "./useHistory";

/**
 * Resolves the analysis to display for AnalysisResult/SkillGap/CareerRoadmap:
 * a just-completed upload's in-memory result takes priority, otherwise an
 * explicit ?id= is fetched, otherwise the most recent history item is used.
 */
export function useLatestOrParamAnalysis(paramId: string | null, stateResult?: AnalysisResult) {
  const historyQuery = useHistory();
  const resolvedId = paramId ?? historyQuery.data?.[0]?.id;
  const detailQuery = useAnalysisDetail(stateResult ? undefined : resolvedId);

  const data = useMemo(() => {
    if (stateResult) return stateResult;
    if (detailQuery.data) return normalizeAnalysisDetail(detailQuery.data);
    return undefined;
  }, [stateResult, detailQuery.data]);

  const isLoading = stateResult ? false : (paramId ? false : historyQuery.isLoading) || detailQuery.isLoading;

  return { data, isLoading, isError: detailQuery.isError || historyQuery.isError };
}
