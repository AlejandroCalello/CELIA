import React from 'react';

interface ShareButtonProps {
  title: string;
  text: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, text, className }) => {
  // The Web Share API is only available in secure contexts (HTTPS) and on certain browsers.
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text,
        url: window.location.href, // Share the current app URL
      });
    } catch (error) {
      // This error is often thrown when the user cancels the share dialog, so we can safely ignore it.
      console.log('Share was cancelled or failed.', error);
    }
  };

  if (!canShare) {
    return null; // Don't render the button if the API is not supported.
  }

  return (
    <button
      onClick={handleShare}
      className={`text-gray-500 hover:text-emerald-600 transition-colors duration-200 ${className}`}
      aria-label="Compartir resultado"
      title="Compartir resultado"
    >
      <i className="fa-solid fa-share-nodes text-xl"></i>
    </button>
  );
};
