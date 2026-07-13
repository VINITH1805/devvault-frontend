export interface GenerateReleaseRequest {
  rawGitDiff: string;
}

export interface GenerateReleaseResponse {
  semanticVersion: string;
  markdownNotes: string;
  socialPost: string;
}

export interface SaveReleaseRequest {
  userId: string;
  title: string;
  rawInput: string;
  markdownNotes: string;
  socialPost: string;
  semanticVersion: string;
}

export interface SavedRelease {
  id: string;
  userId: string;
  title: string;
  rawInput: string;
  markdownNotes: string;
  socialPost: string;
  semanticVersion: string;
  createdAt: string;
}

export interface VaultHistorySummary {
  id: string;
  title: string;
  semanticVersion: string;
  createdAt: string;
}