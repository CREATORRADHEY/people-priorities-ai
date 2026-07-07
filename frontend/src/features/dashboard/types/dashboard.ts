export interface DashboardSummary {
  totalSubmissions: number;
  highPriorityCount: number;
  criticalPriorityCount: number;
  hotspotsCount: number;
  pendingReviewCount: number;
}


export interface PriorityItem {
  submissionId: string;
  title: string;
  locality: string;
  category: string;
  priorityScore: number;
  priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction: string;
  processedAt: string;
}

export interface HotspotItem {
  locality: string;
  issueCount: number;
  topCategory: string;
  isHotspot: boolean;
}

export interface RecommendationItem {
  submissionId: string;
  primaryCategory: string;
  priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedAction: string;
  recommendedDepartment: string;
  urgency: string;
  reason: string;
}

export interface ReviewItem {
  submissionId: string;
  title: string;
  locality: string;
  category: string;
  confidence: number;
  processedAt: string;
}

export interface SubmissionExplorerResponse {
  submission: {
    id: string;
    schemaVersion?: string;
    createdAt?: string;
    serverCreatedAt?: string;
    status: string;
    information: {
      title?: string;
      description?: string;
      issueDescription?: string;
      category: string;
      language: string;
    };
    voice?: {
      duration: number;
      mediaUrl?: string;
    };
    images?: Array<{
      filename: string;
      mimeType: string;
      size: number;
      mediaUrl?: string;
    }>;
    location?: {
      locality?: string;
      ward?: string;
      district?: string;
      latitude?: number;
      longitude?: number;
    };
  };
  analysis?: {
    analysisId?: string;
    summary: string;
    language: string;
    translatedText?: string;
    category: string;
    themes: string[];
    confidence: number;
    recommendation: string;
    reasoning: string;
    reviewRequired: boolean;
    pipelineState: string;
    processedAt: string;
    stateHistory: Array<{
      from: string;
      to: string;
      at: string;
      detail?: string;
    }>;
  };
  intelligence?: {
    intelligenceId?: string;
    primaryCategory: string;
    secondaryCategory?: string;
    categoryConfidence: number;
    normalizedThemes: string[];
    isDuplicate: boolean;
    duplicateOf?: string;
    similarityScore?: number;
    isHotspot: boolean;
    issueCount: number;
    priorityScore: number;
    priorityLevel: string;
    recommendedAction: string;
    recommendedDepartment: string;
    urgency: string;
    recommendationReason: string;
    ieState: string;
    generatedAt: string;
    stateHistory: Array<{
      from: string;
      to: string;
      at: string;
      detail?: string;
    }>;
  };
}

