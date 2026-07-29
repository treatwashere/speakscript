'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchTranscript = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTranscript(null);

    try {
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to retrieve transcript');
      }

      setTranscript(data.transcript);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTranscript = transcript?.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  const copyFullText = () => {
    if (!transcript) return;
    const fullText = transcript.map((t) => t.text).join(' ');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (offsetMs) => {
    const totalSeconds = Math.floor(offsetMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <main style={{ maxWidth: '750px', margin: '50px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>YouTube Speaking Transcript Finder</h1>
      <p style={{ color: '#aaa', marginBottom: '30px' }}>Paste a video link to extract spoken captions and timestamps.</p>

      <form onSubmit={fetchTranscript} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: '15px',
            borderRadius: '8px',
            border: '1px solid #333',
            background: '#161616',
            color: '#fff',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Extracting...' : 'Get Transcript'}
        </button>
      </form>

      {error && <p style={{ color: '#ff4d4f', fontWeight: '500' }}>{error}</p>}

      {transcript && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Search spoken words..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '10px 14px',
                width: '240px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#161616',
                color: '#fff'
              }}
            />
            <button
              onClick={copyFullText}
              style={{
                padding: '10px 18px',
                background: '#222',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Full Text'}
            </button>
          </div>

          <div style={{
            maxHeight: '520px',
            overflowY: 'auto',
            border: '1px solid #222',
            borderRadius: '10px',
            padding: '20px',
            background: '#111'
          }}>
            {filteredTranscript.length === 0 ? (
              <p style={{ color: '#888' }}>No matching lines found.</p>
            ) : (
              filteredTranscript.map((line, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '18px', marginBottom: '12px', fontSize: '15px' }}>
                  <span style={{ color: '#0070f3', fontWeight: 'bold', fontFamily: 'monospace', minWidth: '45px' }}>
                    {formatTime(line.offset)}
                  </span>
                  <span style={{ color: '#ddd', lineHeight: '1.4' }}>{line.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}
