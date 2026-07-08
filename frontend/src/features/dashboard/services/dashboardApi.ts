import apiClient from '../../../services/api/apiClient';
import {
  DashboardSummary,
  PriorityItem,
  HotspotItem,
  RecommendationItem,
  ReviewItem,
  SubmissionExplorerResponse,
} from '../types/dashboard';
import {
  mockSummary,
  mockPriorityQueue,
  mockHotspots,
  mockRecommendations,
  mockReviewQueue,
  mockExplorerDetail,
} from '../constants/mockDashboardData';

interface ApiResponse<T> {
  success: boolean;
  requestId: string;
  data: T;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getDashboardSummary failed. Falling back to high-fidelity mock data.', error);
    return mockSummary;
  }
};

export const getPriorityQueue = async (): Promise<PriorityItem[]> => {
  try {
    const response = await apiClient.get<ApiResponse<PriorityItem[]>>('/dashboard/priorities');
    return response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getPriorityQueue failed. Falling back to high-fidelity mock data.', error);
    return mockPriorityQueue;
  }
};

export const getHotspots = async (): Promise<HotspotItem[]> => {
  try {
    const response = await apiClient.get<ApiResponse<HotspotItem[]>>('/dashboard/hotspots');
    return response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getHotspots failed. Falling back to high-fidelity mock data.', error);
    return mockHotspots;
  }
};

export const getRecommendations = async (): Promise<RecommendationItem[]> => {
  try {
    const response = await apiClient.get<ApiResponse<RecommendationItem[]>>('/dashboard/recommendations');
    return response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getRecommendations failed. Falling back to high-fidelity mock data.', error);
    return mockRecommendations;
  }
};

export const getReviewQueue = async (): Promise<ReviewItem[]> => {
  try {
    const response = await apiClient.get<ApiResponse<ReviewItem[]>>('/dashboard/review');
    return response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getReviewQueue failed. Falling back to high-fidelity mock data.', error);
    return mockReviewQueue;
  }
};

export const getSubmissionExplorer = async (submissionId: string): Promise<SubmissionExplorerResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<SubmissionExplorerResponse>>(`/dashboard/submissions/${submissionId}`);
    return response.data.data;
  } catch (error) {
    console.warn(`[dashboardApi] getSubmissionExplorer for ${submissionId} failed. Falling back to high-fidelity mock data.`, error);
    return mockExplorerDetail(submissionId);
  }
};
