export interface Video {
  id: string;
  youtube_id: string;
  title: string;
  published_at: string;
  created_at: string;
}

export interface Analysis {
  id: string;
  video_id: string;
  summary: string;
  visual_description: string;
  left_keypoints: string;
  right_keypoints: string;
  created_at: string;
}

export interface VideoWithAnalysis extends Video {
  analyses: Analysis;
}
