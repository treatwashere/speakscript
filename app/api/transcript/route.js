import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return Response.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

    if (!transcript || transcript.length === 0) {
      return Response.json({ error: 'No transcript found for this video' }, { status: 404 });
    }

    return Response.json({ transcript });
  } catch (err) {
    return Response.json(
      { error: 'Failed to retrieve transcript. Make sure the video has captions enabled.' },
      { status: 500 }
    );
  }
}
