import React, { useEffect, useRef, useState } from 'react';
import { StarSystem } from '../data/starSystems';
import { soundEngine } from '../utils/soundEngine';

interface Props {
  systems: StarSystem[];
  currentIndex: number;
  isDocked: boolean;
  onDockAtSystem: (index: number) => void;
}

interface Obstacle {
  id: number;
  x: number; // % from left (0..110)
  y: number; // % from top (15..85)
  vx: number;
  vy: number;
  type: 'asteroid' | 'saucer' | 'diaper' | 'borg';
  emoji: string;
  label: string;
  shootCooldown: number;
}

interface LaserBeam {
  id: number;
  x: number;
  y: number;
  vx: number;
  fromPlayer: boolean;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  timer: number;
}

export const SpaceFlightViewport: React.FC<Props> = ({
  systems,
  currentIndex,
  isDocked,
  onDockAtSystem
}) => {
  const currentSystem = systems[currentIndex];
  const progressRatio = currentIndex / Math.max(1, systems.length - 1);

  // Progressive upgrades:
  // 0% - 29%: Phase 1 (Dodge only)
  // 30% - 59%: Phase 2 (Player Phaser Lasers unlocked! Spacebar / Fire button)
  // 60% - 100%: Phase 3 (Enemies also fire red plasma bolts to dodge!)
  const hasPhaserUpgrade = progressRatio >= 0.28 || currentIndex >= 10;
  const enemiesShootBack = progressRatio >= 0.58 || currentIndex >= 21;

  // Wesley is born at checkpoint 2013-04, joins ship AFTER that node is completed (> '2013-04')
  // Ben is born at checkpoint 2015-08, joins ship AFTER that node is completed (> '2015-08')
  const wesleyUnlocked = currentSystem.yearMonth > '2013-04';
  const benUnlocked = currentSystem.yearMonth > '2015-08';

  // Ship state
  const [shipY, setShipY] = useState<number>(50); // 15% to 82%
  const [legProgress, setLegProgress] = useState<number>(0); // 0 to 100% -> at 100% docks at planet!
  const [shieldHitFlash, setShieldHitFlash] = useState<boolean>(false);
  const [upgradeBanner, setUpgradeBanner] = useState<string | null>(null);

  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [lasers, setLasers] = useState<LaserBeam[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  // Refs for smooth 60fps loop access
  const keysRef = useRef<{ up: boolean; down: boolean; right: boolean; left: boolean }>({
    up: false,
    down: false,
    right: false,
    left: false
  });
  const shipYRef = useRef<number>(50);
  const legProgressRef = useRef<number>(0);
  const isDockedRef = useRef<boolean>(isDocked);
  isDockedRef.current = isDocked;

  // Reset leg when undocking to fly to the next Star System
  useEffect(() => {
    if (!isDocked) {
      legProgressRef.current = 0;
      setLegProgress(0);
      setObstacles([]);
      setLasers([]);

      // Show upgrade announcement when hitting 30% or 60% milestone!
      if (currentIndex === 10) {
        setUpgradeBanner('⚡ SHIP UPGRADE UNLOCKED (30%): PHASER CANNONS ONLINE! Press SPACE or FIRE to blast obstacles!');
        soundEngine.playVictory();
        setTimeout(() => setUpgradeBanner(null), 5000);
      } else if (currentIndex === 21) {
        setUpgradeBanner('🚨 SECTOR ALERT (60%): Hostile Saucers Now Fire Red Plasma Bolts! Dodge & Return Fire!');
        soundEngine.playRedAlert();
        setTimeout(() => setUpgradeBanner(null), 5000);
      }
    }
  }, [isDocked, currentIndex]);

  // Fire Player Phaser that locks onto & blows up the nearest obstacle!
  const firePlayerLaser = () => {
    if (isDockedRef.current || !hasPhaserUpgrade) return;
    soundEngine.playPhaser();

    setObstacles((prevObs) => {
      if (prevObs.length === 0) {
        // Still fire a visual beam straight ahead
        setLasers((prevL) => [
          ...prevL,
          { id: Date.now() + Math.random(), x: 26, y: shipYRef.current, vx: 4.5, fromPlayer: true }
        ]);
        return prevObs;
      }

      // Find nearest obstacle in front of the ship
      let nearestIdx = -1;
      let bestDist = 9999;
      prevObs.forEach((o, idx) => {
        if (o.x > 18) {
          const d = Math.hypot(o.x - 24, o.y - shipYRef.current);
          if (d < bestDist) {
            bestDist = d;
            nearestIdx = idx;
          }
        }
      });

      if (nearestIdx !== -1) {
        const target = prevObs[nearestIdx];
        setExplosions((prevE) => [
          ...prevE,
          { id: Date.now() + Math.random(), x: target.x, y: target.y, timer: 12 }
        ]);
        setLasers((prevL) => [
          ...prevL,
          { id: Date.now() + Math.random(), x: 26, y: shipYRef.current, vx: 5.5, fromPlayer: true }
        ]);
        return prevObs.filter((_, idx) => idx !== nearestIdx);
      }

      return prevObs;
    });
  };

  // Keyboard listeners (Arrow keys / WASD + Spacebar for Phaser)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isDockedRef.current) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        keysRef.current.up = true;
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        keysRef.current.down = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        keysRef.current.right = true;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        keysRef.current.left = true;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (hasPhaserUpgrade) {
          firePlayerLaser();
        } else {
          // Before 30% laser upgrade, spacebar gives a quick thruster boost forward!
          keysRef.current.right = true;
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.code === 'Space' && !hasPhaserUpgrade) keysRef.current.right = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [hasPhaserUpgrade]);

  // Main 40ms Arcade Flight Loop (~5-6 seconds of flight between checkpoints!)
  useEffect(() => {
    if (isDocked) return;

    const interval = setInterval(() => {
      // 1. Move Ship Up/Down
      let nextY = shipYRef.current;
      if (keysRef.current.up) nextY = Math.max(14, nextY - 2.6);
      if (keysRef.current.down) nextY = Math.min(82, nextY + 2.6);
      shipYRef.current = nextY;
      setShipY(nextY);

      // 2. Advance Forward Progress (cruises gently forward automatically, 2.5x faster when holding Right Arrow / Boost!)
      const boostMultiplier = keysRef.current.right ? 2.4 : keysRef.current.left ? 0.4 : 1.0;
      const nextProg = Math.min(100, legProgressRef.current + 0.68 * boostMultiplier);
      legProgressRef.current = nextProg;
      setLegProgress(nextProg);

      // Dock when reaching the destination Planet/Starbase at 100%!
      if (nextProg >= 100) {
        soundEngine.playWarp();
        onDockAtSystem(currentIndex);
        return;
      }

      // 3. Spawn occasional Asteroids / Flying Saucers / Diaper Meteors (until planet approaches at 80%)
      if (nextProg < 78 && Math.random() < 0.085) {
        const pool = [
          { type: 'asteroid' as const, emoji: '🪨', label: 'Asteroid' },
          { type: 'saucer' as const, emoji: '🛸', label: 'Flying Saucer' },
          { type: 'diaper' as const, emoji: '🧷', label: 'Rogue Diaper Meteor' },
          { type: 'borg' as const, emoji: '👾', label: 'Space Invader' }
        ];
        const pick = pool[Math.floor(Math.random() * pool.length)];
        setObstacles((prev) => {
          if (prev.length >= 4) return prev;
          return [
            ...prev,
            {
              id: Date.now() + Math.random(),
              x: 104,
              y: 16 + Math.random() * 66,
              vx: -(1.25 + Math.random() * 0.9) * (keysRef.current.right ? 1.35 : 1),
              vy: (Math.random() - 0.5) * 0.45,
              type: pick.type,
              emoji: pick.emoji,
              label: pick.label,
              shootCooldown: 28
            }
          ];
        });
      }

      // 4. Move Obstacles & Check Collisions + Enemy Lasers (at >=60% game progress)
      setObstacles((prev) => {
        const updated: Obstacle[] = [];
        for (const o of prev) {
          const nx = o.x + o.vx * (keysRef.current.right ? 1.4 : 1);
          const ny = Math.max(12, Math.min(86, o.y + o.vy));

          // Check collision with U.S.S. Fifteeners (located around x=18%, y=shipYRef.current)
          if (Math.abs(nx - 18) < 7 && Math.abs(ny - shipYRef.current) < 11) {
            soundEngine.playRedAlert();
            setShieldHitFlash(true);
            setTimeout(() => setShieldHitFlash(false), 350);
            setExplosions((ePrev) => [...ePrev, { id: Date.now() + Math.random(), x: nx, y: ny, timer: 10 }]);
            continue; // Destroy obstacle on bump
          }

          // Enemy saucers fire red lasers when >= 60% through the 15-year mission!
          let nextCooldown = o.shootCooldown - 1;
          if (enemiesShootBack && (o.type === 'saucer' || o.type === 'borg') && nextCooldown <= 0 && nx > 35 && nx < 92) {
            nextCooldown = 42;
            setLasers((lPrev) => [
              ...lPrev,
              { id: Date.now() + Math.random(), x: nx - 3, y: ny, vx: -2.6, fromPlayer: false }
            ]);
          }

          if (nx > -8) {
            updated.push({ ...o, x: nx, y: ny, shootCooldown: nextCooldown });
          }
        }
        return updated;
      });

      // 5. Move Lasers & Check Enemy Laser Hits on Player Ship
      setLasers((prev) => {
        const kept: LaserBeam[] = [];
        for (const l of prev) {
          const nx = l.x + l.vx;
          if (!l.fromPlayer && Math.abs(nx - 18) < 6 && Math.abs(l.y - shipYRef.current) < 10) {
            soundEngine.playRedAlert();
            setShieldHitFlash(true);
            setTimeout(() => setShieldHitFlash(false), 350);
            continue;
          }
          if (nx > -5 && nx < 105) {
            kept.push({ ...l, x: nx });
          }
        }
        return kept;
      });

      // 6. Tick Explosions
      setExplosions((prev) =>
        prev.map((ex) => ({ ...ex, timer: ex.timer - 1 })).filter((ex) => ex.timer > 0)
      );
    }, 40);

    return () => clearInterval(interval);
  }, [isDocked, currentIndex, enemiesShootBack, onDockAtSystem]);

  // Calculate incoming destination Planet/Space Station position on the right side of the screen
  // Starts appearing at legProgress = 55% and docks with the ship at 100%!
  const planetX = legProgress < 50 ? 120 : 100 - ((legProgress - 50) / 50) * 68;

  return (
    <div className={`flight-viewport ${shieldHitFlash ? 'shield-hit' : ''}`}>
      {/* Scrolling Parallax Starfield & Nebula Layers */}
      <div className={`parallax-stars-far ${!isDocked ? 'scrolling' : ''}`} />
      <div className={`parallax-stars-near ${!isDocked ? 'scrolling-fast' : ''}`} />

      {/* Top Flight HUD Bar */}
      <div className="flight-hud-top">
        <div className="hud-mission-target">
          <span className="hud-badge">NEXT CHECKPOINT #{currentSystem.systemNumber}/36</span>
          <strong>
            {currentSystem.planetEmoji} {currentSystem.title} ({currentSystem.yearMonth})
          </strong>
        </div>

        <div className="hud-leg-bar-wrap">
          <div className="hud-leg-bar-fill" style={{ width: `${legProgress}%` }} />
          <span className="hud-leg-text">
            {isDocked
              ? '⚓ DOCKED AT STAR SYSTEM'
              : `🛸 FLYING TO ${currentSystem.yearMonth}: ${Math.round(legProgress)}%`}
          </span>
        </div>

        <div className="hud-weapons-status">
          {!hasPhaserUpgrade && <span className="weapon-pill phase1">🛡️ Phase 1: Dodge Obstacles</span>}
          {hasPhaserUpgrade && !enemiesShootBack && (
            <span className="weapon-pill phase2">🔫 Phase 2: Phasers Online (SPACE)</span>
          )}
          {enemiesShootBack && (
            <span className="weapon-pill phase3">⚡ Phase 3: Enemy Lasers Active!</span>
          )}
        </div>
      </div>

      {/* Upgrade Announcement Toast */}
      {upgradeBanner && <div className="upgrade-toast-banner">{upgradeBanner}</div>}

      {/* THE CUTE ANIMATED STARSHIP U.S.S. FIFTEENERS ON THE LEFT WITH PETER & LUCINDA'S HEADS! */}
      <div
        className={`uss-fifteeners-ship ${keysRef.current.right ? 'boosting' : ''}`}
        style={{ top: `${shipY}%` }}
      >
        {/* Engine Warp Thruster Flame */}
        <div className="ship-thruster-flame">
          <span className="flame-outer" />
          <span className="flame-inner" />
        </div>

        {/* Cute Illustrated Saucer & Cockpit Hull */}
        <div className="ship-hull-body">
          {/* Upper Panoramic Bubble Dome with Cutout Heads Inside! */}
          <div className="ship-cockpit-dome">
            <div className="cockpit-head-bobble lucinda-head" title="Captain Lucinda">
              <img src="/photos/Lucindaheadshot.jpg" alt="Captain Lucinda" />
              <span className="tiny-rank-tag">CAPT. LU</span>
            </div>
            <div className="cockpit-head-bobble peter-head" title="First Officer Peter">
              <img src="/photos/peteheadshot.jpg" alt="First Officer Peter" />
              <span className="tiny-rank-tag">PETER</span>
            </div>
            {wesleyUnlocked && (
              <div className="cockpit-head-bobble kid-head" title="Ensign Wesley">
                <img src="/photos/wesheadshot.jpg" alt="Wesley" />
                <span className="tiny-rank-tag">WES</span>
              </div>
            )}
            {benUnlocked && (
              <div className="cockpit-head-bobble kid-head" title="Cadet Ben">
                <img src="/photos/benHeadshot.JPG" alt="Ben" />
                <span className="tiny-rank-tag">BEN</span>
              </div>
            )}
          </div>

          {/* Saucer Hull with Registry Number */}
          <div className="ship-saucer-deck">
            <span className="hull-registry">U.S.S. FIFTEENERS • NCC-11-11-11</span>
            {hasPhaserUpgrade && <span className="phaser-emitter-nose">⚡</span>}
          </div>

          {/* Lower Warp Nacelle Strut */}
          <div className="ship-nacelle">
            <span className="bussard-collector" />
            <span className="nacelle-glow" />
          </div>
        </div>
      </div>

      {/* Incoming Asteroids & Flying Saucers */}
      {obstacles.map((o) => (
        <div
          key={o.id}
          className={`space-obstacle type-${o.type}`}
          style={{ left: `${o.x}%`, top: `${o.y}%` }}
        >
          <span className="obs-emoji">{o.emoji}</span>
        </div>
      ))}

      {/* Player & Enemy Laser Beams */}
      {lasers.map((l) => (
        <div
          key={l.id}
          className={`laser-bolt ${l.fromPlayer ? 'player-laser' : 'enemy-laser'}`}
          style={{ left: `${l.x}%`, top: `${l.y}%` }}
        />
      ))}

      {/* Explosions */}
      {explosions.map((ex) => (
        <div key={ex.id} className="space-explosion" style={{ left: `${ex.x}%`, top: `${ex.y}%` }}>
          💥
        </div>
      ))}

      {/* Giant Approaching Checkpoint Planet / Space Station */}
      <div
        className={`checkpoint-planet theme-${currentSystem.planetTheme}`}
        style={{ left: `${planetX}%` }}
        onClick={() => onDockAtSystem(currentIndex)}
      >
        <div className="planet-ring" />
        <div className="planet-core">
          <span className="planet-big-emoji">{currentSystem.planetEmoji}</span>
        </div>
        <div className="planet-label-plate">
          <div className="planet-ym">{currentSystem.yearMonth}</div>
          <div className="planet-name">{currentSystem.locationName.split(',')[0]}</div>
        </div>
      </div>

      {/* On-Screen Touch / Click D-Pad & Phaser Controls (Plus Keyboard Hints) */}
      {!isDocked && (
        <div className="flight-controls-dock">
          <div className="dpad-cluster">
            <button
              className="dpad-btn up"
              onMouseDown={() => (keysRef.current.up = true)}
              onMouseUp={() => (keysRef.current.up = false)}
              onTouchStart={() => (keysRef.current.up = true)}
              onTouchEnd={() => (keysRef.current.up = false)}
              onClick={() => {
                shipYRef.current = Math.max(14, shipYRef.current - 9);
                setShipY(shipYRef.current);
              }}
            >
              ▲ UP
            </button>
            <div className="dpad-mid-row">
              <button
                className="dpad-btn left"
                onMouseDown={() => (keysRef.current.left = true)}
                onMouseUp={() => (keysRef.current.left = false)}
                onTouchStart={() => (keysRef.current.left = true)}
                onTouchEnd={() => (keysRef.current.left = false)}
              >
                ◀ SLOW
              </button>
              <button
                className="dpad-btn right boost-btn"
                onMouseDown={() => (keysRef.current.right = true)}
                onMouseUp={() => (keysRef.current.right = false)}
                onTouchStart={() => (keysRef.current.right = true)}
                onTouchEnd={() => (keysRef.current.right = false)}
                onClick={() => {
                  legProgressRef.current = Math.min(100, legProgressRef.current + 18);
                  setLegProgress(legProgressRef.current);
                }}
              >
                WARP BOOST ▶
              </button>
            </div>
            <button
              className="dpad-btn down"
              onMouseDown={() => (keysRef.current.down = true)}
              onMouseUp={() => (keysRef.current.down = false)}
              onTouchStart={() => (keysRef.current.down = true)}
              onTouchEnd={() => (keysRef.current.down = false)}
              onClick={() => {
                shipYRef.current = Math.min(82, shipYRef.current + 9);
                setShipY(shipYRef.current);
              }}
            >
              ▼ DOWN
            </button>
          </div>

          <div className="action-buttons-right">
            {hasPhaserUpgrade && (
              <button className="fire-phaser-big-btn" onClick={firePlayerLaser}>
                🔫 FIRE PHASER (SPACE)
              </button>
            )}
            <button className="skip-dock-btn" onClick={() => onDockAtSystem(currentIndex)}>
              ⚓ Dock Now at {currentSystem.yearMonth}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
