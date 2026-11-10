import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { STAR_SYSTEMS } from './data/starSystems';
import { AwayMissionGame } from './components/AwayMissionGame';
import { MissionDirectorModal } from './components/MissionDirectorModal';
import { SpaceFlightViewport } from './components/SpaceFlightViewport';
import { soundEngine } from './utils/soundEngine';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  MapPin,
  Sparkles,
  Wrench,
  Rocket,
  Camera,
  ExternalLink
} from 'lucide-react';

export const App: React.FC = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isDocked, setIsDocked] = useState<boolean>(true); // Starts docked at 11-11-11 Wedding Starbase, then flies between every checkpoint!
  const [photoIdx, setPhotoIdx] = useState<number>(0);
  const [showDirector, setShowDirector] = useState<boolean>(false);
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const memeVideoRef = useRef<HTMLVideoElement | null>(null);

  const currentSystem = STAR_SYSTEMS[currentIdx];

  useEffect(() => {
    setPhotoIdx(0);
    if (started && isDocked && !showCredits && currentSystem.meme.autoPlayAudioOnOpen && currentSystem.meme.audioSrc) {
      soundEngine.playMemeClip(currentSystem.meme.audioSrc, currentSystem.meme.quote);
    }
    if (currentSystem.id === '2026-11-fifteen-year-finale' && started && isDocked && !showCredits) {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [currentIdx, currentSystem.id, currentSystem.meme, started, isDocked, showCredits]);

  // Launch into side-scrolling flight toward the next Star System, or roll End Credits on the finale!
  const launchToNextSystem = () => {
    soundEngine.stopAll(); // Instantly cuts off long-running music/clips from the completed checkpoint
    if (currentIdx >= STAR_SYSTEMS.length - 1) {
      setShowCredits(true);
      soundEngine.playMemeClip('/media/end-credits.mp3', 'Happy 15th Anniversary, Captain Lucinda!');
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.55 }
      });
      return;
    }
    soundEngine.playWarp();
    setCurrentIdx((prev) => prev + 1);
    setIsDocked(false); // Enters side-scrolling flight mode!
  };

  // Instant jump when clicking a node on the top ribbon or Mission Director
  const jumpToSystemDocked = (idx: number) => {
    if (idx < 0 || idx >= STAR_SYSTEMS.length) return;
    soundEngine.stopAll(); // Instantly cuts off any playing audio
    soundEngine.playTricorderChirp();
    setShowCredits(false);
    setCurrentIdx(idx);
    setIsDocked(true);
  };

  // Wesley is born at checkpoint 2013-04, joins ship AFTER that node is completed (> '2013-04')
  // Ben is born at checkpoint 2015-08, joins ship AFTER that node is completed (> '2015-08')
  const wesleyUnlocked = currentSystem.yearMonth > '2013-04';
  const benUnlocked = currentSystem.yearMonth > '2015-08';

  if (!started) {
    return (
      <div className="title-screen">
        <div className="starfield-bg" />
        <div className="title-card storybook-frame">
          <div className="lcars-top-bar">
            <span>STARDATE 11.11.11 — 11.11.26</span>
            <span>NCC-111111</span>
          </div>

          <div className="ship-illustration-banner">
            <div className="crew-bobble-row">
              <div className="crew-avatar-card">
                <div className="cutout-head-circle">
                  <img src="/photos/11-11-11-Weddign kiss.jpg" alt="Captain Lucinda & Peter" />
                </div>
                <span className="crew-badge gold">Captain Lucinda &amp; First Officer Peter</span>
              </div>
              <div className="crew-avatar-card">
                <div className="cutout-head-circle">
                  <img src="/photos/wesheadshot.jpg" alt="Ensign Wesley" />
                </div>
                <span className="crew-badge red">Ensign Wesley ('13)</span>
              </div>
              <div className="crew-avatar-card">
                <div className="cutout-head-circle">
                  <img src="/photos/benHeadshot.JPG" alt="Cadet Ben" />
                </div>
                <span className="crew-badge blue">Cadet Ben ('15)</span>
              </div>
            </div>
          </div>

          <h1 className="main-game-title">THE 15-YEAR MISSION</h1>
          <h2 className="main-game-subtitle">
            Aboard the <em>U.S.S. Fifteeners</em> — Peter &amp; Lucinda's Side-Scrolling Space Odyssey
          </h2>

          <p className="title-intro-text">
            Pilot the <strong>U.S.S. Fifteeners</strong> through 15 years of marriage! Use the{' '}
            <strong>Arrow Keys</strong> (or on-screen buttons) to dodge asteroids and flying saucers between each
            planet checkpoint!
          </p>

          <div className="title-actions">
            <button
              className="engage-launch-btn"
              onClick={() => {
                soundEngine.playWarp();
                confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 } });
                setStarted(true);
                setIsDocked(true);
              }}
            >
              <Rocket size={24} /> ENGAGE WARP DRIVE (START AT 11-11-11)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasPhotos = currentSystem.photos.length > 0;
  const activePhoto = hasPhotos ? currentSystem.photos[photoIdx] : null;
  const googlePhotosMonthUrl = `https://photos.google.com/search/${currentSystem.yearMonth}`;

  return (
    <div className="game-shell">
      {/* Top Bridge Header */}
      <header className="bridge-header">
        <div className="bridge-brand" onClick={() => setStarted(false)} title="Return to Title Screen">
          <span className="ship-icon">🛸</span>
          <div>
            <div className="ship-name">U.S.S. FIFTEENERS</div>
            <div className="sector-label">{currentSystem.sector}</div>
          </div>
        </div>

        <div className="bridge-crew-bar">
          <div className="mini-crew-pill" title="Captain Lucinda">
            <img src="/photos/Lucindaheadshot.jpg" alt="Captain Lucinda" />
            <span>Capt. Lucinda</span>
          </div>
          <div className="mini-crew-pill" title="First Officer Peter">
            <img src="/photos/peteheadshot.jpg" alt="First Officer Peter" />
            <span>Cmdr. Peter</span>
          </div>
          {wesleyUnlocked && (
            <div className="mini-crew-pill unlocked-pop" title="Ensign Wesley (Joined Apr 2013)">
              <img src="/photos/wesheadshot.jpg" alt="Ensign Wesley" />
              <span>Ensign Wesley</span>
            </div>
          )}
          {benUnlocked && (
            <div className="mini-crew-pill unlocked-pop" title="Cadet Ben (Joined Aug 2015)">
              <img src="/photos/benHeadshot.JPG" alt="Cadet Ben" />
              <span>Cadet Ben</span>
            </div>
          )}
        </div>
      </header>

      {/* FULL-SCREEN SIDE-SCROLLING SPACE FLIGHT VIEWPORT */}
      <div className="flight-stage-container">
        <SpaceFlightViewport
          systems={STAR_SYSTEMS}
          currentIndex={currentIdx}
          isDocked={isDocked}
          onDockAtSystem={() => setIsDocked(true)}
        />

        {/* CHECKPOINT PLANET DIALOG OVERLAY (Pops up when the ship docks at a Star System!) */}
        {isDocked && (
          <div className="checkpoint-dialog-overlay">
            <div className={`system-card storybook-frame checkpoint-popup-card theme-${currentSystem.planetTheme}`}>
              <div className="system-banner">
                <div className="system-num-badge">
                  ⚓ CHECKPOINT #{currentSystem.systemNumber} OF {STAR_SYSTEMS.length}
                </div>
                <div className="stardate-pill">📅 {currentSystem.stardate}</div>
                {currentSystem.locationName && (
                  <span className="location-pill">
                    <MapPin size={14} /> {currentSystem.locationName}
                  </span>
                )}
              </div>

              <h1 className="system-title">
                <span className="title-emoji">{currentSystem.planetEmoji}</span> {currentSystem.title}
              </h1>

              <div className="system-columns">
                {/* LEFT COLUMN: Polaroid Photo Gallery or Archive Postcard */}
                <div className="photo-column">
                  {hasPhotos && activePhoto ? (
                    <div className="polaroid-frame">
                      <div className="polaroid-tape" />
                      <div className="polaroid-img-container">
                        <img src={activePhoto.src} alt={activePhoto.caption} className="polaroid-img" />
                      </div>
                      <p className="polaroid-caption">{activePhoto.caption}</p>

                      {currentSystem.photos.length > 1 && (
                        <div className="polaroid-switcher">
                          {currentSystem.photos.map((_, pIdx) => (
                            <button
                              key={pIdx}
                              className={`photo-dot-btn ${pIdx === photoIdx ? 'active' : ''}`}
                              onClick={() => {
                                soundEngine.playTricorderChirp();
                                setPhotoIdx(pIdx);
                              }}
                            >
                              Photo #{pIdx + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="postcard-fallback-frame">
                      <div className="postcard-stamp">STARFLEET ARCHIVE {currentSystem.yearMonth}</div>
                      <div className="postcard-planet-illustration">{currentSystem.planetEmoji}</div>
                      <h3>{currentSystem.locationName}</h3>
                      <p className="postcard-prompt-box">
                        <Camera size={16} /> <strong>Photo Prompt ({currentSystem.yearMonth}):</strong>{' '}
                        {currentSystem.curation.photoPrompt}
                      </p>
                      <div className="postcard-quick-links">
                        <a
                          href={googlePhotosMonthUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="gphotos-btn"
                        >
                          📸 Open Google Photos ({currentSystem.yearMonth}) <ExternalLink size={13} />
                        </a>
                        <span className="box-badge">📦 {currentSystem.curation.boxFolderHint}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: Captain's Log + Subspace Meme + Silly Checkpoint Interaction */}
                <div className="narrative-column">
                  <div className="captains-log-card">
                    <div className="log-header">📖 CAPTAIN'S LOG — {currentSystem.yearMonth}</div>
                    <p className="log-body">{currentSystem.captainsLog}</p>
                  </div>

                  {!currentSystem.meme.hidden && (
                    <div className="subspace-meme-card">
                      {currentSystem.meme.videoOrGifSrc ? (
                        <div className="meme-gif-wrap" style={{ textAlign: 'center' }}>
                          {/\.(mp4|webm|ogg)$/i.test(currentSystem.meme.videoOrGifSrc) ? (
                            <div>
                              <video
                                ref={memeVideoRef}
                                key={currentSystem.meme.videoOrGifSrc}
                                src={currentSystem.meme.videoOrGifSrc}
                                controls
                                playsInline
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '230px',
                                  borderRadius: '12px',
                                  border: '2.5px solid #1e2436',
                                  background: '#000'
                                }}
                              />
                              <div className="meme-actions" style={{ marginTop: '8px', justifyContent: 'center' }}>
                                <button
                                  className="play-meme-btn"
                                  onClick={() => {
                                    if (memeVideoRef.current) {
                                      memeVideoRef.current.currentTime = 0;
                                      memeVideoRef.current.play();
                                    }
                                  }}
                                >
                                  <Play size={15} /> Play Clip
                                </button>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={currentSystem.meme.videoOrGifSrc}
                              alt="Meme GIF"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '220px',
                                borderRadius: '12px',
                                border: '2.5px solid #1e2436'
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <>
                          {currentSystem.meme.imageSrc && (
                            <div className="meme-img-wrap" style={{ textAlign: 'center', marginBottom: '10px' }}>
                              <img
                                src={currentSystem.meme.imageSrc}
                                alt={currentSystem.meme.title}
                                referrerPolicy="no-referrer"
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '190px',
                                  objectFit: 'contain',
                                  borderRadius: '12px',
                                  border: '2.5px solid #1e2436'
                                }}
                              />
                            </div>
                          )}
                          <blockquote className="meme-quote">"{currentSystem.meme.quote}"</blockquote>
                          {!currentSystem.meme.hideAudioLinks && (
                            <div className="meme-actions" style={{ marginTop: '10px', justifyContent: 'flex-end' }}>
                              <button
                                className="play-meme-btn"
                                onClick={() =>
                                  soundEngine.playMemeClip(currentSystem.meme.audioSrc, currentSystem.meme.quote)
                                }
                              >
                                <Volume2 size={15} /> Play Sound Clip
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <AwayMissionGame
                    systemId={currentSystem.id}
                    interaction={currentSystem.interaction}
                    onComplete={() =>
                      setCompletedIds((prev) => ({
                        ...prev,
                        [currentSystem.id]: true
                      }))
                    }
                  />
                </div>
              </div>

              {/* Bottom Undock & Fly to Next Planet Bar */}
              <div className="warp-footer-bar">
                <button
                  className="nav-warp-btn prev"
                  disabled={currentIdx === 0}
                  onClick={() => jumpToSystemDocked(currentIdx - 1)}
                >
                  <ChevronLeft size={20} /> Prev Checkpoint
                </button>

                {(() => {
                  const hasInteractiveChallenge = currentSystem.interaction.type !== 'warp_only';
                  const isInteractionCompleted = completedIds[currentSystem.id] ?? false;
                  const isNextDisabled = hasInteractiveChallenge && !isInteractionCompleted;

                  return (
                    <button
                      className="nav-warp-btn next launch-flight-btn"
                      disabled={isNextDisabled}
                      title={
                        isNextDisabled
                          ? 'Complete the away mission interaction above to warp!'
                          : ''
                      }
                      onClick={launchToNextSystem}
                    >
                      {currentIdx === STAR_SYSTEMS.length - 1 ? (
                        <>
                          🎬 Next: Roll End Credits! <ChevronRight size={20} />
                        </>
                      ) : (
                        <>
                          🚀 Launch &amp; Fly to Next Planet (
                          {STAR_SYSTEMS[Math.min(STAR_SYSTEMS.length - 1, currentIdx + 1)].yearMonth}){' '}
                          <ChevronRight size={20} />
                        </>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* SHORT END CREDITS SCENE OVERLAY */}
        {showCredits && (
          <div className="checkpoint-dialog-overlay">
            <div
              className="system-card storybook-frame checkpoint-popup-card theme-gold"
              style={{
                maxWidth: '820px',
                background: 'linear-gradient(180deg, #0d1326 0%, #17213e 60%, #1e1638 100%)',
                color: '#f8fafc',
                textAlign: 'center',
                padding: '28px 32px'
              }}
            >
              <div className="lcars-top-bar" style={{ marginBottom: '18px' }}>
                <span>STARFLEET COMMAND • MISSION COMPLETE</span>
                <span>STARDATE 11.11.2011 — 11.11.2026</span>
              </div>

              <h1
                style={{
                  fontSize: '2.1rem',
                  color: '#fbbf24',
                  margin: '0 0 6px 0',
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 10px rgba(251, 191, 36, 0.35)'
                }}
              >
                ✨ THE 15-YEAR MISSION ✨
              </h1>
              <p style={{ fontSize: '1.08rem', color: '#fde68a', margin: '0 0 20px 0', fontWeight: 600 }}>
                Happy 15th Anniversary, Captain Lucinda! (11-11-11 to 11-11-26)
              </p>

              {/* Crew Cast Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '14px',
                  marginBottom: '20px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '2px solid rgba(251, 191, 36, 0.4)'
                }}
              >
                <div>
                  <img
                    src="/photos/Lucindaheadshot.jpg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/photos/11-11-11-Weddign kiss.jpg';
                    }}
                    alt="Captain Lucinda"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #fbbf24'
                    }}
                  />
                  <div style={{ fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>CAPTAIN LUCINDA</div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Commanding Officer &amp; Heart of the Ship</div>
                </div>

                <div>
                  <img
                    src="/photos/peteheadshot.jpg"
                    alt="Commander Peter"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #38bdf8'
                    }}
                  />
                  <div style={{ fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>COMMANDER PETER</div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>First Officer &amp; Chief Engineer</div>
                </div>

                <div>
                  <img
                    src="/photos/wesheadshot.jpg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/photos/5-7-14-WesAt1.jpg';
                    }}
                    alt="Ensign Wesley"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #f87171'
                    }}
                  />
                  <div style={{ fontWeight: 800, color: '#f87171', marginTop: '6px' }}>ENSIGN WESLEY</div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Joined Crew April 2013 • Helm &amp; Lego Ops</div>
                </div>

                <div>
                  <img
                    src="/photos/benHeadshot.JPG"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/photos/8-21-15firstWEs-ben.jpg';
                    }}
                    alt="Cadet Ben"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #34d399'
                    }}
                  />
                  <div style={{ fontWeight: 800, color: '#34d399', marginTop: '6px' }}>CADET BEN</div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Joined Crew August 2015 • Science &amp; Cotton Candy</div>
                </div>
              </div>

              {/* Short Credits Roll Box */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  border: '1.5px solid rgba(148, 163, 184, 0.3)',
                  marginBottom: '18px',
                  lineHeight: 1.65,
                  fontSize: '0.96rem'
                }}
              >
                <p style={{ margin: '0 0 8px 0', color: '#fde68a', fontWeight: 700 }}>
                  🛸 FILMED ON LOCATION ACROSS 33 STAR SYSTEMS (2011–2026)
                </p>
                <p style={{ margin: '0 0 10px 0', color: '#e2e8f0', fontSize: '0.9rem' }}>
                  Valley Church Cupertino • Kauai • Sunnyvale Garage • Twin Lakes &amp; Capitola • Lake Tahoe •
                  Yosemite Valley • Disneyland • Monterey Bay Aquarium • Cal Academy of Sciences • Hiller Aviation
                  Museum • Cupertino • LEGOLAND &amp; San Diego • Hong Kong • Gilroy Gardens • Fremont Older • San
                  Francisco Zoo • Great Wolf Lodge • Great America • Castle Rock • Costa Rica • Universal Studios •
                  Filoli Gardens
                </p>
                <p style={{ margin: 0, color: '#fbbf24', fontStyle: 'italic', fontSize: '1.02rem' }}>
                  "Five-card stud, nothing wild... and the sky's the limit. Here's to the next 50+ years together. I
                  love you, Lucinda!" — Peter 💖
                </p>
              </div>

              {/* Music Replay & Navigation Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <button
                  className="nav-warp-btn prev"
                  onClick={() => setShowCredits(false)}
                >
                  <ChevronLeft size={18} /> Back to Checkpoint #33
                </button>

                <button
                  className="play-meme-btn"
                  onClick={() =>
                    soundEngine.playMemeClip('/media/end-credits.mp3', 'Happy 15th Anniversary, Captain Lucinda!')
                  }
                  style={{ padding: '10px 18px', fontSize: '0.95rem' }}
                >
                  <Volume2 size={17} /> Replay End Credits Theme
                </button>

                <button
                  className="nav-warp-btn next launch-flight-btn"
                  onClick={() => {
                    setShowCredits(false);
                    setCurrentIdx(0);
                    setIsDocked(true);
                  }}
                >
                  <Sparkles size={18} /> Replay Mission from 11-11-11
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDirector && (
        <MissionDirectorModal
          systems={STAR_SYSTEMS}
          currentIndex={currentIdx}
          onSelectSystem={(idx) => jumpToSystemDocked(idx)}
          onClose={() => setShowDirector(false)}
        />
      )}
    </div>
  );
};
