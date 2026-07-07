import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardSummary,
  getPriorityQueue,
  getHotspots,
  getRecommendations,
  getReviewQueue,
  getSubmissionExplorer,
} from '../services/dashboardApi';
import {
  DashboardSummary,
  PriorityItem,
  HotspotItem,
  RecommendationItem,
  ReviewItem,
  SubmissionExplorerResponse,
} from '../types/dashboard';

export interface UseDashboardDataResult {
  summary: {
    data: DashboardSummary | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  };
  priorities: {
    data: PriorityItem[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  };
  hotspots: {
    data: HotspotItem[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  };
  recommendations: {
    data: RecommendationItem[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  };
  reviewQueue: {
    data: ReviewItem[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
  };
  explorer: {
    data: SubmissionExplorerResponse | null;
    loading: boolean;
    error: string | null;
    fetchExplorer: (id: string) => Promise<void>;
    clear: () => void;
  };
}

export const useDashboardData = (): UseDashboardDataResult => {
  // Summary State
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Priorities State
  const [prioritiesData, setPrioritiesData] = useState<PriorityItem[] | null>(null);
  const [prioritiesLoading, setPrioritiesLoading] = useState<boolean>(true);
  const [prioritiesError, setPrioritiesError] = useState<string | null>(null);

  // Hotspots State
  const [hotspotsData, setHotspotsData] = useState<HotspotItem[] | null>(null);
  const [hotspotsLoading, setHotspotsLoading] = useState<boolean>(true);
  const [hotspotsError, setHotspotsError] = useState<string | null>(null);

  // Recommendations State
  const [recsData, setRecsData] = useState<RecommendationItem[] | null>(null);
  const [recsLoading, setRecsLoading] = useState<boolean>(true);
  const [recsError, setRecsError] = useState<string | null>(null);

  // Review Queue State
  const [reviewData, setReviewData] = useState<ReviewItem[] | null>(null);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Explorer Detail State
  const [explorerData, setExplorerData] = useState<SubmissionExplorerResponse | null>(null);
  const [explorerLoading, setExplorerLoading] = useState<boolean>(false);
  const [explorerError, setExplorerError] = useState<string | null>(null);

  // Fetch Summary
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await getDashboardSummary();
      setSummaryData(data);
    } catch (err: any) {
      console.error('[useDashboardData] Summary load error:', err);
      setSummaryError(err.message || 'Failed to load summary metrics.');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Fetch Priorities
  const fetchPriorities = useCallback(async () => {
    setPrioritiesLoading(true);
    setPrioritiesError(null);
    try {
      const data = await getPriorityQueue();
      setPrioritiesData(data);
    } catch (err: any) {
      console.error('[useDashboardData] Priorities load error:', err);
      setPrioritiesError(err.message || 'Failed to load priorities queue.');
    } finally {
      setPrioritiesLoading(false);
    }
  }, []);

  // Fetch Hotspots
  const fetchHotspots = useCallback(async () => {
    setHotspotsLoading(true);
    setHotspotsError(null);
    try {
      const data = await getHotspots();
      setHotspotsData(data);
    } catch (err: any) {
      console.error('[useDashboardData] Hotspots load error:', err);
      setHotspotsError(err.message || 'Failed to load hotspot data.');
    } finally {
      setHotspotsLoading(false);
    }
  }, []);

  // Fetch Recommendations
  const fetchRecommendations = useCallback(async () => {
    setRecsLoading(true);
    setRecsError(null);
    try {
      const data = await getRecommendations();
      setRecsData(data);
    } catch (err: any) {
      console.error('[useDashboardData] Recommendations load error:', err);
      setRecsError(err.message || 'Failed to load recommendation directives.');
    } finally {
      setRecsLoading(false);
    }
  }, []);

  // Fetch Review Queue
  const fetchReviewQueue = useCallback(async () => {
    setReviewLoading(true);
    setReviewError(null);
    try {
      const data = await getReviewQueue();
      setReviewData(data);
    } catch (err: any) {
      console.error('[useDashboardData] Review queue load error:', err);
      setReviewError(err.message || 'Failed to load review queue.');
    } finally {
      setReviewLoading(false);
    }
  }, []);

  // Fetch Explorer
  const fetchExplorerDetail = useCallback(async (id: string) => {
    setExplorerLoading(true);
    setExplorerError(null);
    try {
      const data = await getSubmissionExplorer(id);
      setExplorerData(data);
    } catch (err: any) {
      console.error('[useDashboardData] Explorer load error:', err);
      setExplorerError(err.message || `Failed to load explorer details for ${id}.`);
    } finally {
      setExplorerLoading(false);
    }
  }, []);

  const clearExplorer = useCallback(() => {
    setExplorerData(null);
    setExplorerError(null);
  }, []);

  // Initial loads on mount
  useEffect(() => {
    fetchSummary();
    fetchPriorities();
    fetchHotspots();
    fetchRecommendations();
    fetchReviewQueue();
  }, [fetchSummary, fetchPriorities, fetchHotspots, fetchRecommendations, fetchReviewQueue]);

  return {
    summary: {
      data: summaryData,
      loading: summaryLoading,
      error: summaryError,
      refetch: fetchSummary,
    },
    priorities: {
      data: prioritiesData,
      loading: prioritiesLoading,
      error: prioritiesError,
      refetch: fetchPriorities,
    },
    hotspots: {
      data: hotspotsData,
      loading: hotspotsLoading,
      error: hotspotsError,
      refetch: fetchHotspots,
    },
    recommendations: {
      data: recsData,
      loading: recsLoading,
      error: recsError,
      refetch: fetchRecommendations,
    },
    reviewQueue: {
      data: reviewData,
      loading: reviewLoading,
      error: reviewError,
      refetch: fetchReviewQueue,
    },
    explorer: {
      data: explorerData,
      loading: explorerLoading,
      error: explorerError,
      fetchExplorer: fetchExplorerDetail,
      clear: clearExplorer,
    },
  };
};
