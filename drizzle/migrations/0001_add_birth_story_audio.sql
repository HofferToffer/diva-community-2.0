ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_story_audio text;

CREATE POLICY "Users can read own birth story audio"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'birth-stories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own birth story audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'birth-stories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own birth story audio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'birth-stories' AND auth.uid()::text = (storage.foldername(name))[1]);