
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '../pages/Index';

interface QRCodeGeneratorProps {
  event: Event;
}

export const QRCodeGenerator = ({ event }: QRCodeGeneratorProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const generateEventUrl = () => {
    const eventData = {
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      category: event.category,
      organizer: event.organizer
    };
    
    // Create a shareable URL with event data
    const baseUrl = window.location.origin;
    const encodedData = encodeURIComponent(JSON.stringify(eventData));
    return `${baseUrl}?event=${encodedData}`;
  };

  const generateQRCode = async () => {
    try {
      const eventUrl = generateEventUrl();
      const qrDataUrl = await QRCode.toDataURL(eventUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrDataUrl);
      setShowQR(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${event.title}-qr-code.png`;
      link.click();
    }
  };

  const shareEvent = async () => {
    const eventUrl = generateEventUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: eventUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(eventUrl);
      }
    } else {
      copyToClipboard(eventUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Event link copied to clipboard!');
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={generateQRCode}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
        
        <Button
          onClick={shareEvent}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {showQR && qrCodeUrl && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-center space-y-3">
            <img src={qrCodeUrl} alt="Event QR Code" className="mx-auto" />
            <p className="text-sm text-gray-600">
              Scan to view event details
            </p>
            <Button
              onClick={downloadQRCode}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
