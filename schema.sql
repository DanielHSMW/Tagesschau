-- Tabelle: videos
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    youtube_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: analyses
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE UNIQUE,
    summary TEXT NOT NULL,
    visual_description TEXT NOT NULL,
    left_keypoints TEXT NOT NULL,
    right_keypoints TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) aktivieren
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Public read access erlauben
CREATE POLICY "Public read access for videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Public read access for analyses" ON analyses FOR SELECT USING (true);
