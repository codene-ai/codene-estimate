'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  estimateId: string;
}

export function DownloadButton({ estimateId }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      // Get estimate data from localStorage
      const stored = localStorage.getItem(`estimate-${estimateId}`);
      const body = stored ? JSON.parse(stored) : {};

      const response = await fetch(`/api/estimate-pdf/${estimateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estimate-${estimateId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="no-print neu-btn-raised inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-foreground disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  );
}
