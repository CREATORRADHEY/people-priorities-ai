import {
  DashboardSummary,
  PriorityItem,
  HotspotItem,
  RecommendationItem,
  ReviewItem,
  SubmissionExplorerResponse,
} from '../types/dashboard';

export const mockSummary: DashboardSummary = {
  totalSubmissions: 254,
  highPriorityCount: 42,
  criticalPriorityCount: 18,
  hotspotsCount: 5,
  pendingReviewCount: 12,
};

export const mockPriorityQueue: PriorityItem[] = [
  {
    submissionId: 'sub-cr-01',
    title: 'Severe Water Contamination in Sector 4',
    locality: 'Sector 4, Rohini',
    category: 'Water Supply & Sewage',
    priorityScore: 94,
    priorityLevel: 'CRITICAL',
    recommendedAction: 'Immediate water pipeline flushing and public health advisory deployment.',
    processedAt: '2026-07-08T10:15:00Z',
  },
  {
    submissionId: 'sub-cr-02',
    title: 'Major Road Cave-in on Main Bypass Road',
    locality: 'Dwarka Sector 10 Bypass',
    category: 'Roads & Infrastructure',
    priorityScore: 89,
    priorityLevel: 'CRITICAL',
    recommendedAction: 'Barricade bypass lane, reroute traffic, and initiate emergency road restoration.',
    processedAt: '2026-07-08T09:30:00Z',
  },
  {
    submissionId: 'sub-hi-03',
    title: 'Recurring Power Outages near District Hospital',
    locality: 'Janakpuri West',
    category: 'Electricity & Lighting',
    priorityScore: 78,
    priorityLevel: 'HIGH',
    recommendedAction: 'Deploy backup substation generator and schedule feeder line audit.',
    processedAt: '2026-07-08T08:45:00Z',
  },
  {
    submissionId: 'sub-hi-04',
    title: 'Illegal Garbage Dumping near Government Primary School',
    locality: 'Karol Bagh Outer',
    category: 'Public Health & Sanitation',
    priorityScore: 75,
    priorityLevel: 'HIGH',
    recommendedAction: 'Deploy sanitation patrol, clear dump yard, and install surveillance cameras.',
    processedAt: '2026-07-08T08:12:00Z',
  },
  {
    submissionId: 'sub-med-05',
    title: 'Broken Streetlights on Park Avenue Street',
    locality: 'Saket Residential block B',
    category: 'Electricity & Lighting',
    priorityScore: 55,
    priorityLevel: 'MEDIUM',
    recommendedAction: 'Dispatch maintenance van to replace 8 faulty LED streetlight bulbs.',
    processedAt: '2026-07-07T18:22:00Z',
  }
];

export const mockHotspots: HotspotItem[] = [
  {
    locality: 'Sector 4, Rohini',
    issueCount: 14,
    topCategory: 'Water Supply & Sewage',
    isHotspot: true,
  },
  {
    locality: 'Karol Bagh Outer',
    issueCount: 9,
    topCategory: 'Public Health & Sanitation',
    isHotspot: true,
  },
  {
    locality: 'Dwarka Sector 10 Bypass',
    issueCount: 8,
    topCategory: 'Roads & Infrastructure',
    isHotspot: true,
  },
  {
    locality: 'Saket Residential block B',
    issueCount: 7,
    topCategory: 'Electricity & Lighting',
    isHotspot: false,
  },
  {
    locality: 'Janakpuri West',
    issueCount: 6,
    topCategory: 'Electricity & Lighting',
    isHotspot: false,
  }
];

export const mockRecommendations: RecommendationItem[] = [
  {
    submissionId: 'sub-cr-01',
    primaryCategory: 'Water Supply & Sewage',
    priorityLevel: 'CRITICAL',
    recommendedAction: 'Launch urgent pipeline audit and deploy emergency water distribution tankers.',
    recommendedDepartment: 'Municipal Corporation Water Supply Division',
    urgency: 'CRITICAL',
    reason: 'Detected heavy lead trace alerts & toxic odor reports from 14 adjacent households.',
  },
  {
    submissionId: 'sub-cr-02',
    primaryCategory: 'Roads & Infrastructure',
    priorityLevel: 'CRITICAL',
    recommendedAction: 'Initiate structural repair for road cave-in and block active traffic lanes.',
    recommendedDepartment: 'Public Works Department (PWD)',
    urgency: 'CRITICAL',
    reason: 'Deep structural sinkhole posing severe vehicular accident risk on high-speed bypass.',
  },
  {
    submissionId: 'sub-hi-03',
    primaryCategory: 'Electricity & Lighting',
    priorityLevel: 'HIGH',
    recommendedAction: 'Schedule priority grid maintenance and inspect local transformer overload.',
    recommendedDepartment: 'State Electricity Board',
    urgency: 'HIGH',
    reason: 'Critical hospital power backup is failing due to consecutive voltage spikes.',
  },
  {
    submissionId: 'sub-hi-04',
    primaryCategory: 'Public Health & Sanitation',
    priorityLevel: 'HIGH',
    recommendedAction: 'Clear illegal dump site and enforce penalty boards with security oversight.',
    recommendedDepartment: 'Department of Public Health & Environment',
    urgency: 'HIGH',
    reason: 'Accumulating dump pile attracting stray animal packs next to children school path.',
  }
];

export const mockReviewQueue: ReviewItem[] = [
  {
    submissionId: 'sub-rev-01',
    title: 'Pothole Complaints near Market Exit',
    locality: 'Connaught Place block G',
    category: 'Roads & Infrastructure',
    confidence: 65,
    processedAt: '2026-07-08T11:02:00Z',
  },
  {
    submissionId: 'sub-rev-02',
    title: 'Water pressure low during evening hours',
    locality: 'Vasant Kunj Sector C',
    category: 'Water Supply & Sewage',
    confidence: 72,
    processedAt: '2026-07-08T10:44:00Z',
  },
  {
    submissionId: 'sub-rev-03',
    title: 'Park maintenance request - broken benches',
    locality: 'Greater Kailash 1',
    category: 'Other Public Grievances',
    confidence: 58,
    processedAt: '2026-07-08T09:12:00Z',
  }
];

export const mockExplorerDetail = (submissionId: string): SubmissionExplorerResponse => {
  // Find match in mock prioritites
  const matchedPriority = mockPriorityQueue.find(p => p.submissionId === submissionId);
  const matchedRec = mockRecommendations.find(r => r.submissionId === submissionId);
  
  const title = matchedPriority?.title || 'Reported Water Logging on Main Street';
  const category = matchedPriority?.category || 'Water Supply & Sewage';
  const locality = matchedPriority?.locality || 'Sector 4, Rohini';
  const recAction = matchedRec?.recommendedAction || 'Schedule regular sewer clearing patrol.';
  const recDept = matchedRec?.recommendedDepartment || 'Municipal Corporation Sanitation Wing';
  const priorityLevel = matchedPriority?.priorityLevel || 'HIGH';
  const priorityScore = matchedPriority?.priorityScore || 75;
  const reason = matchedRec?.reason || 'Localized flooding blocking emergency vehicle access.';

  return {
    submission: {
      id: submissionId,
      schemaVersion: '1.0.0',
      createdAt: '2026-07-08T10:15:00Z',
      serverCreatedAt: '2026-07-08T10:15:32Z',
      status: 'PROCESSED',
      information: {
        title,
        description: `There is a severe issue regarding ${category.toLowerCase()} in ${locality}. The community is facing major disruptions. Children cannot cross streets due to the flooding and traffic is at a complete standstill. Please prioritize.`,
        category,
        language: 'English',
      },
      voice: {
        duration: 12,
        mediaUrl: 'mock-audio-placeholder',
      },
      images: [
        {
          filename: 'evidence.jpg',
          mimeType: 'image/jpeg',
          size: 145000,
        }
      ],
      location: {
        locality,
        ward: 'Ward No 24',
        district: 'North Delhi',
        latitude: 28.7041,
        longitude: 77.1025,
      }
    },
    analysis: {
      analysisId: `an-${submissionId}`,
      summary: `Severe grievance regarding ${category.toLowerCase()} registered in ${locality}.`,
      language: 'English',
      category,
      themes: [category, 'Public Safety', 'Traffic Disruption'],
      confidence: 0.94,
      recommendation: recAction,
      reasoning: 'Grievance reports direct physical blockade and health hazards for children.',
      reviewRequired: false,
      pipelineState: 'COMPLETED',
      processedAt: '2026-07-08T10:16:00Z',
      stateHistory: [
        { from: 'RECEIVED', to: 'ANALYZING', at: '2026-07-08T10:15:40Z' },
        { from: 'ANALYZING', to: 'COMPLETED', at: '2026-07-08T10:16:00Z' }
      ]
    },
    intelligence: {
      intelligenceId: `intel-${submissionId}`,
      primaryCategory: category,
      categoryConfidence: 0.96,
      normalizedThemes: [category, 'Infrastructure Vulnerability'],
      isDuplicate: false,
      isHotspot: true,
      issueCount: 14,
      priorityScore,
      priorityLevel,
      recommendedAction: recAction,
      recommendedDepartment: recDept,
      urgency: priorityLevel,
      recommendationReason: reason,
      ieState: 'COMPLETED',
      generatedAt: '2026-07-08T10:16:15Z',
      stateHistory: [
        { from: 'PENDING', to: 'INTELLIGENCE_GENERATED', at: '2026-07-08T10:16:15Z' }
      ]
    }
  };
};
