export const metadata = {
  title: 'SpeakScript',
  description: 'Extract and search YouTube speaking transcripts',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a', color: '#ededed' }}>
        {children}
      </body>
    </html>
  );
}
