import React, { useState, useEffect, useRef } from 'react';
import { StarSystemInteraction } from '../data/starSystems';
import { soundEngine } from '../utils/soundEngine';

interface Props {
  systemId: string;
  interaction: StarSystemInteraction;
  onComplete: () => void;
}

export const AwayMissionGame: React.FC<Props> = ({ systemId, interaction, onComplete }) => {
  // Choice state
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  // Bridge Battle state
  const [bossHp, setBossHp] = useState<number>(100);
  const [battleLog, setBattleLog] = useState<string>('');
  const [usedAttacks, setUsedAttacks] = useState<number[]>([]);

  // Phaser Defense / Catch state
  const [score, setScore] = useState<number>(0);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number }[]>([]);

  // Shuttle Jump state
  const [shuttleGameStarted, setShuttleGameStarted] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [obstacleX, setObstacleX] = useState<number>(100);
  const [jumpCount, setJumpCount] = useState<number>(0);
  const isJumpingRef = useRef<boolean>(false);
  isJumpingRef.current = isJumping;

  // Shelf Organizer state (4 messy boxes -> click to line up neatly)
  const [organizedBoxes, setOrganizedBoxes] = useState<boolean[]>([false, false, false, false]);

  // Reset when changing Star System
  useEffect(() => {
    setSelectedChoice(null);
    setBossHp(100);
    setBattleLog('');
    setUsedAttacks([]);
    setScore(0);
    setShuttleGameStarted(false);
    setJumpCount(0);
    setObstacleX(100);
    setOrganizedBoxes([false, false, false, false]);

    if (interaction.type === 'phaser_defense') {
      const initialTargets = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 55
      }));
      setTargets(initialTargets);
    }
  }, [systemId, interaction.type]);

  // Shuttle Jump obstacle animation loop
  useEffect(() => {
    if (interaction.type !== 'shuttle_jump' || !shuttleGameStarted) return;
    const goal = (interaction.miniGameConfig?.goalCount || 6) + 2; // Lasts 8 jumps for longer fun!
    if (jumpCount >= goal) return;

    const timer = setInterval(() => {
      setObstacleX((prev) => {
        if (prev <= 5) {
          // Obstacle reached the end!
          setJumpCount((c) => {
            const next = c + 1;
            if (next >= goal) {
              soundEngine.playVictory();
              onComplete();
            } else {
              soundEngine.playTricorderChirp();
            }
            return next;
          });
          return 100;
        }
        return prev - 2.8; // Smooth, paced movement so player has time to react and jump!
      });
    }, 50);

    return () => clearInterval(timer);
  }, [interaction.type, shuttleGameStarted, jumpCount, interaction.miniGameConfig?.goalCount, onComplete]);

  // Spacebar support for Shuttle Jump & Phaser Defense
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (interaction.type === 'shuttle_jump') {
          e.preventDefault();
          triggerJump();
        } else if (interaction.type === 'phaser_defense' && targets.length > 0) {
          e.preventDefault();
          handleHitTarget(targets[0].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const triggerJump = () => {
    if (isJumping) return;
    soundEngine.playPhaser();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 550);
  };

  const handleHitTarget = (id: number) => {
    soundEngine.playPhaser();
    const goal = interaction.miniGameConfig?.goalCount || 6;
    const nextScore = score + 1;
    setScore(nextScore);

    if (nextScore >= goal) {
      soundEngine.playVictory();
      setTargets([]);
      onComplete();
    } else {
      setTargets((prev) =>
        prev.map((t) =>
          t.id === id
            ? { id: Date.now() + Math.random(), x: 12 + Math.random() * 76, y: 15 + Math.random() * 60 }
            : t
        )
      );
    }
  };

  // 1. WARP ONLY (Simple Story Stop)
  if (interaction.type === 'warp_only') {
    return (
      <div className="interaction-box warp-only-box">
        <div className="away-badge">✨ STAR SYSTEM LOGGED IN SHIP ARCHIVES</div>
        <p className="away-subtext">Sensors clear! Ready to warp to the next Star System whenever you are.</p>
      </div>
    );
  }

  // 2. STARFLEET COMMAND CHOICE
  if (interaction.type === 'choice' && interaction.choices) {
    return (
      <div className="interaction-box choice-box">
        <div className="away-badge">🖖 STARFLEET COMMAND DECISION</div>
        <h4 className="away-title">{interaction.prompt}</h4>
        <div className="choice-grid">
          {interaction.choices.map((c, idx) => (
            <button
              key={idx}
              className={`choice-btn ${selectedChoice === idx ? 'selected' : ''}`}
              onClick={() => {
                soundEngine.playTricorderChirp();
                setSelectedChoice(idx);
                onComplete();
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        {selectedChoice !== null && (
          <div className="choice-outcome-banner">
            <strong>Captain's Log Outcome:</strong> {interaction.choices[selectedChoice].outcome}
          </div>
        )}
      </div>
    );
  }

  // 3. RED ALERT BRIDGE BATTLE
  if (interaction.type === 'bridge_battle' && interaction.attacks) {
    const defeated = bossHp <= 0;
    return (
      <div className={`interaction-box battle-box ${defeated ? 'battle-won' : ''}`}>
        <div className="away-badge red-alert-badge">
          {defeated ? '🎉 RED ALERT CLEARED — ENEMY DEFEATED!' : '🚨 RED ALERT! TACTICAL BRIDGE BATTLE'}
        </div>
        <div className="boss-arena">
          <div className="boss-avatar-wrap">
            <span className={`boss-emoji ${defeated ? 'boss-defeated' : 'boss-floating'}`}>
              {interaction.bossEmoji || '👾'}
            </span>
          </div>
          <div className="boss-info">
            <h4>{interaction.bossName}</h4>
            <p className="boss-subtitle">{interaction.bossSubtitle}</p>
            <div className="hp-bar-outer">
              <div className="hp-bar-inner" style={{ width: `${Math.max(0, bossHp)}%` }} />
              <span className="hp-label">BOSS SHIELDS: {Math.max(0, bossHp)}%</span>
            </div>
          </div>
        </div>

        {battleLog && <div className="battle-log-box">⚡ {battleLog}</div>}

        {!defeated ? (
          <div className="attack-grid">
            {interaction.attacks.map((atk, idx) => (
              <button
                key={idx}
                className={`attack-btn ${usedAttacks.includes(idx) ? 'used' : ''}`}
                onClick={() => {
                  soundEngine.playPhaser();
                  const nextHp = Math.max(0, bossHp - 35);
                  setBossHp(nextHp);
                  setBattleLog(atk.resultText);
                  setUsedAttacks((prev) => [...prev, idx]);
                  if (nextHp <= 0) {
                    setTimeout(() => soundEngine.playVictory(), 250);
                    onComplete();
                  }
                }}
              >
                {atk.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="victory-banner">
            🏆 <strong>Victory!</strong> Captain Lucinda and First Officer Peter saved the ship!
          </div>
        )}
      </div>
    );
  }

  // 4. PHASER DEFENSE / CATCH MINI-GAME (Consolidated into neat 4-item line-up below)

  // 5. SHUTTLE JUMP MINI-GAME
  if (interaction.type === 'shuttle_jump' && interaction.miniGameConfig) {
    const cfg = interaction.miniGameConfig;
    const goal = (cfg.goalCount || 6) + 2;
    const won = jumpCount >= goal;
    return (
      <div className="interaction-box minigame-box">
        <div className="away-badge">🚀 SHUTTLECRAFT JUMP MISSION</div>
        <div className="minigame-header">
          <div>
            <h4>{cfg.title}</h4>
            <p>{cfg.instruction}</p>
          </div>
          <div className="score-pill">
            Cleared: {jumpCount} / {goal}
          </div>
        </div>

        {!shuttleGameStarted && !won ? (
          <div
            className="shuttle-arena"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default'
            }}
          >
            <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
              {cfg.playerEmoji || '🚚'} 💨 {cfg.targetEmoji || '📦'}
            </div>
            <button
              className="jump-action-btn"
              style={{
                position: 'static',
                transform: 'none',
                padding: '8px 24px',
                fontSize: '0.96rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                background: '#ffaa00'
              }}
              onClick={() => {
                soundEngine.playTricorderChirp();
                setShuttleGameStarted(true);
                setObstacleX(100);
              }}
            >
              ▶️ START MINI-GAME
            </button>
          </div>
        ) : !won ? (
          <div className="shuttle-arena" onClick={triggerJump}>
            <div className="shuttle-sky-stars">✨ ⭐ 🌟 ✨</div>
            <div className={`shuttle-sprite ${isJumping ? 'jumping' : ''}`}>
              {cfg.playerEmoji || '🚚'}
            </div>
            <div className="shuttle-obstacle" style={{ left: `${obstacleX}%` }}>
              {cfg.targetEmoji || '📦'}
            </div>
            <div className="shuttle-road" />
            <button className="jump-action-btn" onClick={(e) => { e.stopPropagation(); triggerJump(); }}>
              ⬆️ TAP HERE OR PRESS SPACE TO JUMP!
            </button>
          </div>
        ) : (
          <div className="victory-banner">🏆 {cfg.victoryMessage}</div>
        )}
      </div>
    );
  }

  // 6. TRICORDER SCANNER MINI-GAME
  if (interaction.type === 'tricorder_scan' && interaction.miniGameConfig) {
    const cfg = interaction.miniGameConfig;
    const won = score >= cfg.goalCount;
    const pct = Math.min(100, Math.round((score / cfg.goalCount) * 100));
    return (
      <div className="interaction-box tricorder-box">
        <div className="away-badge">📟 STARFLEET TRICORDER INTERACTION</div>
        <h4>{cfg.title}</h4>
        <p>{cfg.instruction}</p>

        <div className="tricorder-meter-wrap">
          <div className="tricorder-meter-fill" style={{ width: `${pct}%` }} />
          <span className="tricorder-meter-text">SCAN PROGRESS: {pct}%</span>
        </div>

        {!won ? (
          <button
            className="tricorder-scan-btn"
            onClick={() => {
              soundEngine.playTricorderChirp();
              const next = score + 1;
              setScore(next);
              if (next >= cfg.goalCount) {
                setTimeout(() => soundEngine.playVictory(), 200);
                onComplete();
              }
            }}
          >
            {cfg.targetEmoji} PULSE TRICORDER BEAM ({score}/{cfg.goalCount})
          </button>
        ) : (
          <div className="victory-banner">🏆 {cfg.victoryMessage}</div>
        )}
      </div>
    );
  }

  // 7. LUCINDA'S GARAGE SHELF ORGANIZER MINI-GAME (4 messy items -> click to line up neatly)
  if ((interaction.type === 'shelf_organizer' || interaction.type === 'phaser_defense') && interaction.miniGameConfig) {
    const cfg = interaction.miniGameConfig;
    const organizedCount = organizedBoxes.filter(Boolean).length;
    const allOrganized = organizedCount === 4;

    // Messy starting offsets vs. neat lined-up positions on the shelf
    const messyStyles = [
      { left: '8%', top: '52%', transform: 'rotate(-28deg)' },
      { left: '34%', top: '60%', transform: 'rotate(22deg)' },
      { left: '58%', top: '48%', transform: 'rotate(-19deg)' },
      { left: '78%', top: '58%', transform: 'rotate(31deg)' }
    ];
    const neatStyles = [
      { left: '14%', top: '12%', transform: 'rotate(0deg)' },
      { left: '34%', top: '12%', transform: 'rotate(0deg)' },
      { left: '54%', top: '12%', transform: 'rotate(0deg)' },
      { left: '74%', top: '12%', transform: 'rotate(0deg)' }
    ];

    return (
      <div className="interaction-box minigame-box">
        <div className="away-badge">📦 CAPTAIN LUCINDA'S ORGANIZATION PROTOCOL</div>
        <div className="minigame-header">
          <div>
            <h4>{cfg.title}</h4>
            <p>{cfg.instruction}</p>
          </div>
          <div className="score-pill">{organizedCount} / 4 Neat</div>
        </div>

        <div
          className="shelf-organizer-arena"
          style={{
            position: 'relative',
            height: '185px',
            background: 'linear-gradient(180deg, #1e293b, #0f172a)',
            border: '3px solid #1e2436',
            borderRadius: '14px',
            overflow: 'hidden'
          }}
        >
          {/* The Overhead Garage Shelf Beam */}
          <div
            style={{
              position: 'absolute',
              top: '44%',
              left: '8%',
              right: '8%',
              height: '8px',
              background: '#ffaa00',
              border: '2px solid #fff',
              borderRadius: '4px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}
          />

          {/* The 4 Boxes */}
          {[0, 1, 2, 3].map((idx) => {
            const isNeat = organizedBoxes[idx];
            const pos = isNeat ? neatStyles[idx] : messyStyles[idx];
            return (
              <button
                key={idx}
                onClick={() => {
                  if (isNeat) return;
                  soundEngine.playTricorderChirp();
                  const next = [...organizedBoxes];
                  next[idx] = true;
                  setOrganizedBoxes(next);
                  if (next.every(Boolean)) {
                    setTimeout(() => soundEngine.playVictory(), 200);
                    onComplete();
                  }
                }}
                style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  transform: pos.transform,
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  background: isNeat ? '#22c55e' : '#fef3c7',
                  border: '2.5px solid #1e2436',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  cursor: isNeat ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 5
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{cfg.targetEmoji}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#1e2436' }}>
                  {isNeat ? `✓ ${cfg.neatLabelPrefix || 'BIN'} #${idx + 1}` : 'CLICK TO TIDY'}
                </span>
              </button>
            );
          })}

          {/* Bottom Context Banner */}
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#334155',
              color: '#fff',
              border: '2px solid #94a3b8',
              borderRadius: '999px',
              padding: '3px 16px',
              fontSize: '0.8rem',
              fontWeight: 800,
              whiteSpace: 'nowrap'
            }}
          >
            {cfg.bottomBannerText || '🚗 Legendary PT Cruiser (Parked Underneath)'}
          </div>
        </div>

        {allOrganized && <div className="victory-banner">🏆 {cfg.victoryMessage}</div>}
      </div>
    );
  }

  return null;
};
