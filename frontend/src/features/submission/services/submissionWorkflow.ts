import { SubmissionDraft } from '../types/submissionDraft';
import { SubmissionPayload, SubmissionResult, SubmissionWorkflowState } from '../types/api';
import { submissionApi } from '../../../services/api/submissionApi';
import { mediaApi } from '../../../services/api/mediaApi';

export class SubmissionWorkflow {
  /**
   * Executes the sequential phases of the submission process:
   * 1. Create Submission record (Draft metadata)
   * 2. Upload voice audio files (WebM format)
   * 3. Upload images (Evidence list)
   * 4. Finalize
   *
   * Stops immediately and returns a typed error object if any step fails.
   */
  static async submit(
    draft: SubmissionDraft,
    onStateChange: (state: SubmissionWorkflowState) => void
  ): Promise<SubmissionResult> {
    try {
      if (!draft.information) {
        throw new Error('Missing form information');
      }

      // 1. Prepare JSON metadata payload
      onStateChange(SubmissionWorkflowState.CREATING_SUBMISSION);
      const payload: SubmissionPayload = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        information: {
          title: draft.information.title,
          description: draft.information.description,
          category: draft.information.category,
          language: draft.information.language
        },
        voice: draft.voice?.duration ? { duration: draft.voice.duration } : undefined,
        images: draft.images?.map((img) => ({
          filename: img.file.name,
          mimeType: img.mimeType,
          size: img.size
        })) || [],
        location: draft.location ? {
          latitude: draft.location.latitude,
          longitude: draft.location.longitude,
          accuracy: draft.location.accuracy,
          locality: draft.location.locality,
          ward: draft.location.ward,
          landmark: draft.location.landmark,
          source: draft.location.source,
          capturedAt: draft.location.capturedAt
        } : undefined
      };

      // 2. Phase 1: POST Metadata
      const createResponse = await submissionApi.createSubmission(payload);
      if (!createResponse.success || !createResponse.data.submissionId) {
        throw new Error('Failed to create submission on server');
      }
      const submissionId = createResponse.data.submissionId;

      // 3. Phase 2: Upload Voice file if exists
      const voiceBlob = draft.voice?.blob || null;
      if (voiceBlob) {
        onStateChange(SubmissionWorkflowState.UPLOADING_VOICE);
        const voiceUpload = await mediaApi.uploadMedia(submissionId, voiceBlob, []);
        if (!voiceUpload.success) {
          throw new Error('Voice media upload failed');
        }
      }

      // 4. Phase 3: Upload Image files if exist
      const imageFiles = draft.images?.map((img) => img.file) || [];
      if (imageFiles.length > 0) {
        onStateChange(SubmissionWorkflowState.UPLOADING_IMAGES);
        const imagesUpload = await mediaApi.uploadMedia(submissionId, null, imageFiles);
        if (!imagesUpload.success) {
          throw new Error('Images media upload failed');
        }
      }

      // 5. Phase 4: Finalize
      onStateChange(SubmissionWorkflowState.FINALIZING);
      onStateChange(SubmissionWorkflowState.DONE);

      // Save local grievance for live dashboard sync
      try {
        const localGrievance = {
          submissionId: submissionId,
          title: draft.information?.title || 'Untitled Grievance',
          category: draft.information?.category || 'General Grievance',
          locality: draft.location?.locality || 'Constituency Area',
          description: draft.information?.description || '',
          priorityScore: Math.floor(70 + Math.random() * 25),
          priorityLevel: Math.random() > 0.45 ? 'HIGH' : 'CRITICAL',
          recommendedAction: `Inspect and address category reports in ${draft.location?.locality || 'Constituency Area'}.`,
          processedAt: new Date().toISOString()
        };
        const localList = JSON.parse(localStorage.getItem('local_submissions') || '[]');
        localList.unshift(localGrievance);
        localStorage.setItem('local_submissions', JSON.stringify(localList));
      } catch (e) {
        console.error('LocalStorage write failed:', e);
      }

      return {
        success: true,
        submissionId: submissionId,
        requestId: createResponse.requestId
      };
    } catch (error: any) {
      console.error('[SubmissionWorkflow] Submission sequence aborted:', error);
      onStateChange(SubmissionWorkflowState.ERROR);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during submission.'
      };
    }
  }
}
