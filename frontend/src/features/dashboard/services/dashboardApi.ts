import apiClient from '../../../services/api/apiClient';
import {
  DashboardSummary,
  PriorityItem,
  HotspotItem,
  RecommendationItem,
  ReviewItem,
  SubmissionExplorerResponse,
} from '../types/dashboard';

interface ApiResponse<T> {
  success: boolean;
  requestId: string;
  data: T;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
  return response.data.data;
};

export const getPriorityQueue = async (): Promise<PriorityItem[]> => {
  const response = await apiClient.get<ApiResponse<PriorityItem[]>>('/dashboard/priorities');
  return response.data.data;
};

export const getHotspots = async (): Promise<HotspotItem[]> => {
  const response = await apiClient.get<ApiResponse<HotspotItem[]>>('/dashboard/hotspots');
  return response.data.data;
};

export const getRecommendations = async (): Promise<RecommendationItem[]> => {
  const response = await apiClient.get<ApiResponse<RecommendationItem[]>>('/dashboard/recommendations');
  return response.data.data;
};

export const getReviewQueue = async (): Promise<ReviewItem[]> => {
  const response = await apiClient.get<ApiResponse<ReviewItem[]>>('/dashboard/review');
  return response.data.data;
};

export const getSubmissionExplorer = async (submissionId: string): Promise<SubmissionExplorerResponse> => {
  const response = await apiClient.get<ApiResponse<SubmissionExplorerResponse>>(`/dashboard/submissions/${submissionId}`);
  return response.data.data;
};
