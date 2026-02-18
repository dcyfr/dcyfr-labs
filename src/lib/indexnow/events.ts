export const INDEXNOW_EVENTS = {
  submissionRequested: 'indexnow/submission.requested',
} as const;

export interface IndexNowSubmissionRequestedEventData {
  urls: string[];
  key: string;
  keyLocation: string;
  requestId: string;
  requestedAt: number;
  userAgent?: string;
  ip?: string;
}
