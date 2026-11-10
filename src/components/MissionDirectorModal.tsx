import React, { useState } from 'react';
import { StarSystem } from '../data/starSystems';
import { CheckCircle2, ImagePlus, ExternalLink, Sparkles, Play, Filter } from 'lucide-react';

interface Props {
  systems: StarSystem[];
  currentIndex: number;
  onSelectSystem: (index: number) => void;
  onClose: () => void;
}

export const MissionDirectorModal: React.FC<Props> = ({
  systems,
  currentIndex,
  onSelectSystem,
  onClose
}) => {
  const [filter, setFilter] = useState<'all' | 'needs_photo' | 'ready'>('all');

  const readyCount = systems.filter((s) => s.photos.length > 0).length;
  const filteredSystems = systems.filter((s) => {
    if (filter === 'needs_photo') return s.photos.length === 0;
    if (filter === 'ready') return s.photos.length > 0;
    return true;
  });

  return (
    <div className="director-modal-backdrop" onClick={onClose}>
      <div className="director-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="director-header">
          <div>
            <span className="lcars-pill">🛠️ PETER'S MISSION DIRECTOR & PHOTO TRACKER</span>
            <h2>U.S.S. Fifteeners — Star System Curation Tracker</h2>
            <p>
              <strong>{readyCount} of {systems.length} Star Systems</strong> currently have real photos loaded in{' '}
              <code>public/photos/</code>. Click any <strong>📸 Google Photos (YYYY-MM)</strong> button below or check{' '}
              <strong>Lucinda's Box.com (YYYY-MM)</strong> folder!
            </p>
          </div>
          <button className="close-director-btn" onClick={onClose}>
            ✕ Return to Bridge
          </button>
        </div>

        <div className="director-toolbar">
          <div className="filter-group">
            <Filter size={16} />
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Star Systems ({systems.length})
            </button>
            <button
              className={`filter-btn ${filter === 'needs_photo' ? 'active' : ''}`}
              onClick={() => setFilter('needs_photo')}
            >
              📸 Needs Photo ({systems.length - readyCount})
            </button>
            <button
              className={`filter-btn ${filter === 'ready' ? 'active' : ''}`}
              onClick={() => setFilter('ready')}
            >
              ✅ Has Photo ({readyCount})
            </button>
          </div>
          <div className="director-tip">
            💡 Drop new photos into <code>c:\code\fifteeners\public\photos\</code> and tell me the filename!
          </div>
        </div>

        <div className="director-table-wrap">
          <table className="director-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Month</th>
                <th>Star System Title & Location</th>
                <th>Photo Status & Prompt</th>
                <th>Quick Lookup Links</th>
                <th>Meme / Audio Gag Suggestion</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSystems.map((sys) => {
                const realIdx = systems.findIndex((x) => x.id === sys.id);
                const hasPhotos = sys.photos.length > 0;
                const googlePhotosUrl = `https://photos.google.com/search/${sys.yearMonth}`;
                const youtubeMemeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                  sys.meme.searchQuery || ''
                )}`;

                return (
                  <tr key={sys.id} className={realIdx === currentIndex ? 'current-row' : ''}>
                    <td className="sys-num-cell">#{sys.systemNumber}</td>
                    <td className="month-cell">
                      <span className="month-badge">{sys.yearMonth}</span>
                    </td>
                    <td>
                      <div className="sys-title-cell">
                        <span>{sys.planetEmoji}</span> <strong>{sys.title}</strong>
                      </div>
                      <div className="sys-loc-sub">{sys.locationName}</div>
                    </td>
                    <td>
                      {hasPhotos ? (
                        <div className="status-badge ready">
                          <CheckCircle2 size={15} /> {sys.photos.length} Photo(s) Loaded
                        </div>
                      ) : (
                        <div className="status-badge needs">
                          <ImagePlus size={15} /> Needs Photo
                        </div>
                      )}
                      <div className="prompt-note">{sys.curation.photoPrompt}</div>
                    </td>
                    <td className="links-cell">
                      <a
                        href={googlePhotosUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="lookup-link gphotos"
                      >
                        📸 Google Photos ({sys.yearMonth}) <ExternalLink size={12} />
                      </a>
                      <div className="box-hint">📦 {sys.curation.boxFolderHint}</div>
                    </td>
                    <td>
                      <div className="meme-cell-title">
                        <Sparkles size={13} /> <strong>{sys.meme.title}</strong>
                      </div>
                      <div className="meme-cell-quote">"{sys.meme.quote}"</div>
                      <a
                        href={youtubeMemeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="lookup-link yt-link"
                      >
                        🎬 Find Clip on YouTube <ExternalLink size={11} />
                      </a>
                    </td>
                    <td>
                      <button
                        className="jump-sys-btn"
                        onClick={() => {
                          onSelectSystem(realIdx);
                          onClose();
                        }}
                      >
                        <Play size={14} /> Warp Here
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
