'use client';

import { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize, ExternalLink } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { formatNumber } from '@/lib/utils';

interface StreamEmbedProps {
  channel?: string;
  platform?: 'kick' | 'twitch';
}

export function StreamEmbed({ channel = 'your-channel', platform = 'kick' }: StreamEmbedProps) {
  const [isMuted, setIsMuted] = useState(true);
  const streamInfo = useAppStore((state) => state.streamInfo);

  const embedUrl = platform === 'kick'
    ? `https://player.kick.com/${channel}?muted=${isMuted ? 1 : 0}&autoplay=true`
    : `https://player.twitch.tv/?channel=${channel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&muted=${isMuted}`;

  const channelUrl = platform === 'kick'
    ? `https://kick.com/${channel}`
    : `https://twitch.tv/${channel}`;

  return (
    <div className="relative w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      {/* Stream Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {streamInfo.isLive && (
              <Badge variant="danger" className="animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full mr-1.5" />
                LIVE
              </Badge>
            )}
            <div className="text-white">
              <h3 className="font-bold">{streamInfo.title || 'Stream Offline'}</h3>
              {streamInfo.isLive && (
                <p className="text-sm text-gray-300">
                  {streamInfo.game} • {formatNumber(streamInfo.viewerCount)} viewers
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Stream Player */}
      <div className="relative aspect-video bg-black">
        {streamInfo.isLive ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            {streamInfo.thumbnailUrl ? (
              <img
                src={streamInfo.thumbnailUrl}
                alt="Stream thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Play className="w-12 h-12 text-gray-500" />
              </div>
            )}
            <h3 className="text-xl font-bold text-white z-10">Stream is Offline</h3>
            <p className="text-gray-400 mt-2 z-10">Check back later for live content!</p>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 z-10"
            >
              <Button variant="outline">
                Visit Channel
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        )}
      </div>

      {/* Stream Controls */}
      {streamInfo.isLive && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                const iframe = document.querySelector('iframe');
                iframe?.requestFullscreen?.();
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
