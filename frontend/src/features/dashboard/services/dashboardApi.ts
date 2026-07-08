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

// Helpers to load local submissions from LocalStorage
const getLocalSubmissions = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('local_submissions') || '[]');
  } catch (e) {
    return [];
  }
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  let baseSummary = mockSummary;
  try {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    baseSummary = response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getDashboardSummary failed. Falling back to mock base.', error);
  }
  
  const local = getLocalSubmissions();
  return {
    totalSubmissions: baseSummary.totalSubmissions + local.length,
    highPriorityCount: baseSummary.highPriorityCount + local.filter(x => x.priorityLevel === 'HIGH').length,
    criticalPriorityCount: baseSummary.criticalPriorityCount + local.filter(x => x.priorityLevel === 'CRITICAL').length,
    hotspotsCount: baseSummary.hotspotsCount,
    pendingReviewCount: baseSummary.pendingReviewCount,
  };
};

export const getPriorityQueue = async (): Promise<PriorityItem[]> => {
  let baseQueue = mockPriorityQueue;
  try {
    const response = await apiClient.get<ApiResponse<PriorityItem[]>>('/dashboard/priorities');
    baseQueue = response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getPriorityQueue failed. Falling back to mock base.', error);
  }
  
  const local = getLocalSubmissions();
  const localPriorityItems: PriorityItem[] = local.map(x => ({
    submissionId: x.submissionId,
    title: x.title,
    locality: x.locality,
    category: x.category,
    priorityScore: x.priorityScore,
    priorityLevel: x.priorityLevel,
    recommendedAction: x.recommendedAction,
    processedAt: x.processedAt,
  }));

  return [...localPriorityItems, ...baseQueue];
};

export const getHotspots = async (): Promise<HotspotItem[]> => {
  let baseHotspots = mockHotspots;
  try {
    const response = await apiClient.get<ApiResponse<HotspotItem[]>>('/dashboard/hotspots');
    baseHotspots = response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getHotspots failed. Falling back to mock base.', error);
  }
  return baseHotspots;
};

export const getRecommendations = async (): Promise<RecommendationItem[]> => {
  let baseRecs = mockRecommendations;
  try {
    const response = await apiClient.get<ApiResponse<RecommendationItem[]>>('/dashboard/recommendations');
    baseRecs = response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getRecommendations failed. Falling back to mock base.', error);
  }
  
  const local = getLocalSubmissions();
  const localRecs: RecommendationItem[] = local.map(x => ({
    submissionId: x.submissionId,
    primaryCategory: x.category,
    priorityLevel: x.priorityLevel,
    recommendedAction: x.recommendedAction,
    recommendedDepartment: `Municipal ${x.category} Division`,
    urgency: x.priorityLevel,
    reason: `Grievance registered locally with description: "${x.description.substring(0, 60)}..."`,
  }));

  return [...localRecs, ...baseRecs];
};

export const getReviewQueue = async (): Promise<ReviewItem[]> => {
  let baseReview = mockReviewQueue;
  try {
    const response = await apiClient.get<ApiResponse<ReviewItem[]>>('/dashboard/review');
    baseReview = response.data.data;
  } catch (error) {
    console.warn('[dashboardApi] getReviewQueue failed. Falling back to mock base.', error);
  }
  return baseReview;
};

export const getSubmissionExplorer = async (submissionId: string): Promise<SubmissionExplorerResponse> => {
  const local = getLocalSubmissions();
  const found = local.find(x => x.submissionId === submissionId);
  
  if (found) {
    return {
      submission: {
        id: found.submissionId,
        schemaVersion: '1.0.0',
        createdAt: found.processedAt,
        serverCreatedAt: found.processedAt,
        status: 'PROCESSED',
        information: {
          title: found.title,
          description: found.description,
          category: found.category,
          language: 'English',
        },
        location: {
          locality: found.locality,
          ward: 'Local Ward',
          district: 'Constituency Central',
        }
      },
      analysis: {
        summary: `Citizen registered a ${found.category.toLowerCase()} concern in ${found.locality}.`,
        language: 'English',
        category: found.category,
        themes: [found.category, 'Local Infrastructure'],
        confidence: 0.92,
        recommendation: found.recommendedAction,
        reasoning: 'Grievance description analyzed via constituency priority directives.',
        reviewRequired: false,
        pipelineState: 'COMPLETED',
        processedAt: found.processedAt,
        stateHistory: []
      },
      intelligence: {
        primaryCategory: found.category,
        categoryConfidence: 0.94,
        normalizedThemes: [found.category],
        isDuplicate: false,
        isHotspot: false,
        issueCount: 1,
        priorityScore: found.priorityScore,
        priorityLevel: found.priorityLevel,
        recommendedAction: found.recommendedAction,
        recommendedDepartment: `Municipal ${found.category} Division`,
        urgency: found.priorityLevel,
        recommendationReason: 'Immediate local priority action recommendation based on citizen severity grading.',
        ieState: 'COMPLETED',
        generatedAt: found.processedAt,
        stateHistory: []
      }
    };
  }

  try {
    const response = await apiClient.get<ApiResponse<SubmissionExplorerResponse>>(`/dashboard/submissions/${submissionId}`);
    return response.data.data;
  } catch (error) {
    console.warn(`[dashboardApi] getSubmissionExplorer for ${submissionId} failed. Falling back to mock.`, error);
    return mockExplorerDetail(submissionId);
  }
};
