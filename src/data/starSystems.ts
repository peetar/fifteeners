export type InteractionType =
  | 'choice'
  | 'bridge_battle'
  | 'phaser_defense'
  | 'shuttle_jump'
  | 'tricorder_scan'
  | 'shelf_organizer'
  | 'warp_only';

export interface StarSystemPhoto {
  src: string;
  caption: string;
}

export interface StarSystemMeme {
  title: string;
  quote: string;
  hidden?: boolean;
  audioSrc?: string;
  autoPlayAudioOnOpen?: boolean;
  hideYoutubeLink?: boolean;
  videoOrGifSrc?: string;
  imageSrc?: string;
  hideAudioLinks?: boolean;
  searchQuery?: string;
  suggestionNote?: string;
}

export interface StarSystemInteraction {
  type: InteractionType;
  prompt?: string;
  choices?: { label: string; outcome: string }[];
  bossName?: string;
  bossEmoji?: string;
  bossSubtitle?: string;
  attacks?: { label: string; resultText: string }[];
  miniGameConfig?: {
    title: string;
    instruction: string;
    targetEmoji: string;
    playerEmoji?: string;
    neatLabelPrefix?: string;
    bottomBannerText?: string;
    goalCount: number;
    victoryMessage: string;
  };
}

export interface StarSystem {
  id: string;
  systemNumber: number;
  yearMonth: string; // YYYY-MM for Google Photos & Box.com
  stardate: string;
  sector: string;
  title: string;
  locationName: string;
  coords?: { lat: number; lng: number };
  planetTheme: 'gold' | 'blue' | 'emerald' | 'crimson' | 'purple' | 'ice' | 'sunset';
  planetEmoji: string;
  captainsLog: string;
  photos: StarSystemPhoto[];
  meme: StarSystemMeme;
  interaction: StarSystemInteraction;
  curation: {
    status: 'ready' | 'needs_photo' | 'needs_meme_clip';
    photoPrompt: string;
    boxFolderHint: string;
    notesForPeter: string;
  };
}

export const STAR_SYSTEMS: StarSystem[] = [
  // ==========================================
  // SECTOR 1: THE NEWLYWED FRONTIER (2011-2012)
  // ==========================================
  {
    id: '2011-11-wedding',
    systemNumber: 1,
    yearMonth: '2011-11',
    stardate: 'November 11, 2011 (11-11-11)',
    sector: 'Sector 1: The Newlywed Frontier (2011–2012)',
    title: 'Launch from Valley Church Starbase (11-11-11)',
    locationName: 'Valley Church, Cupertino, CA -> Sunnyvale Home Base',
    coords: { lat: 37.3125, lng: -122.0468 },
    planetTheme: 'gold',
    planetEmoji: '💍',
    captainsLog:
      "Captain's Log, Stardate 11.11.11. Today Captain Lucinda and First Officer Peter officially commissioned the U.S.S. Fifteeners at Valley Church! Immediately following the ceremony, we set course for our very first Starbase in Sunnyvale to begin our 15-year mission together.",
    photos: [
      {
        src: '/photos/11-11-11-Weddign kiss.jpg',
        caption: '11-11-11: The Wedding Kiss at Valley Church!'
      }
    ],
    meme: {
      title: 'Star Trek: The Next Generation — Captain Picard',
      quote: 'Make it so! ... Engage!',
      videoOrGifSrc: 'https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUybmx5ZGQ1ZTZhNmJsbHgxbDBhMHRzNnl3b29zZGgzaGRibWt0enJ5NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wNlks0ID1igO4/200w.gif',
      searchQuery: 'Captain Picard Make it so Engage clip',
      suggestionNote: 'Classic Picard "Engage!" finger point clip as the ship launches on 11-11-11.'
    },
    interaction: {
      type: 'choice',
      prompt: 'Starfleet Launch Protocol: How shall we christen the U.S.S. Fifteeners on 11-11-11?',
      choices: [
        {
          label: '🥂 Seal it with the Legendary Wedding Kiss & Warp to Sunnyvale',
          outcome: 'All wedding guests cheer! Warp engines online—Sunnyvale Starbase coordinates locked in!'
        },
        {
          label: '🖖 Set Phasers to "Married" & Punch It to Warp 11',
          outcome: 'Stardate 11-11-11 permanently etched into Starfleet history! Next stop: Aloha Sector!'
        }
      ]
    },
    curation: {
      status: 'ready',
      photoPrompt: 'Have wedding kiss photo! Optionally add reception or Sunnyvale move-in photo.',
      boxFolderHint: 'Box.com -> 2011 / 2011-11',
      notesForPeter: 'Photo already loaded (/photos/11-11-11-Weddign kiss.jpg).'
    }
  },
  {
    id: '2011-11-hawaii-honeymoon',
    systemNumber: 2,
    yearMonth: '2011-11',
    stardate: 'November 2011',
    sector: 'Sector 1: The Newlywed Frontier (2011–2012)',
    title: 'Shore Leave on Pleasure Planet Risa (Hawaii Honeymoon)',
    locationName: 'Hawaiian Islands',
    coords: { lat: 20.7984, lng: -156.3319 },
    planetTheme: 'sunset',
    planetEmoji: '🌺',
    captainsLog:
      "After launching the marriage, the crew took immediate shore leave in Hawaii! Right on cue, First Officer Peter came down with the flu—so Captain Lucinda kept him alive with steady infusions of POG juice (Passion-Orange-Guava) and marathon episodes of Law & Order during the day, before rallying every night to go out and explore the island resort!",
    photos: [
      {
        src: '/photos/hawaiispray.jpg',
        caption: 'November 2011: Ocean spray on the Hawaii Honeymoon!'
      }
    ],
    meme: {
      title: 'Captain Picard on Risa',
      quote: 'Aloha! Welcome to Planet Risa—please place your Horga\'hn statue on the beach towel.',
      imageSrc: '/photos/picard_risa.jpg',
      hideAudioLinks: true,
      searchQuery: 'Captain Picard Risa Star Trek',
      suggestionNote: 'Picard on Risa image with caption!'
    },
    interaction: {
      type: 'choice',
      prompt: 'Honeymoon Medical & Tactical Log: Peter has the flu in paradise! What is the command order?',
      choices: [
        {
          label: '🧃 Day Shift: Administer life-saving POG juice & binge Law & Order ("DUN-DUN!")',
          outcome: 'Medical triumph! Captain Lucinda\'s POG juice protocol restores Peter\'s HP from 5% back to 80%!'
        },
        {
          label: '🌙 Night Shift: Rally after sunset & go explore the island resort together!',
          outcome: 'Second wind achieved! Tropical breezes, night walks around the resort, and an unforgettable honeymoon!'
        }
      ]
    },
    curation: {
      status: 'ready',
      photoPrompt: 'Loaded hawaiispray.jpg & picard_risa.jpg!',
      boxFolderHint: 'Box.com -> 2011-11 or Honeymoon folder',
      notesForPeter: 'Hawaii photo and Picard Risa meme loaded!'
    }
  },
  {
    id: '2011-12-hk-beijing',
    systemNumber: 3,
    yearMonth: '2011-12',
    stardate: 'Late 2011 / Early 2012',
    sector: 'Sector 1: The Newlywed Frontier (2011–2012)',
    title: 'Trans-Pacific Warp: Hong Kong & Beijing Expedition',
    locationName: 'Hong Kong & Beijing, China',
    coords: { lat: 39.9042, lng: 116.4074 },
    planetTheme: 'crimson',
    planetEmoji: '🐉',
    captainsLog:
      "Stardate 2011.9: Why stop at Hawaii when you can cross the International Date Line? Peter and Lucinda embarked on an epic trans-Pacific expedition to Hong Kong and Beijing—where we loved staying with family and eating mountains of incredible food in Hong Kong, followed by our private chauffeured tour of Beijing and the Great Wall!",
    photos: [
      {
        src: '/photos/greatwall.jpg',
        caption: 'Our private chauffeured tour to the Great Wall of China in Beijing!'
      }
    ],
    meme: {
      title: 'Indiana Jones Travel Map Theme',
      quote: '',
      videoOrGifSrc: 'https://i.makeagif.com/media/8-15-2023/ZWBhN2.gif',
      hideAudioLinks: true,
      searchQuery: 'Indiana Jones map flight theme clip',
      suggestionNote: 'Animated travel map GIF loaded!'
    },
    interaction: {
      type: 'tricorder_scan',
      miniGameConfig: {
        title: 'Orbital Scan: The Great Wall & Hong Kong Feasts',
        instruction: 'Click to calibrate the Starfleet Long-Range Sensors across Hong Kong & Beijing!',
        targetEmoji: '🏯',
        goalCount: 3,
        victoryMessage: 'Orbital scan complete! Family feasts in Hong Kong and private Beijing tour logged!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'greatwall.jpg & animated GIF loaded!',
      boxFolderHint: 'Box.com -> 2011-12 or China/HK trip folder',
      notesForPeter: 'Updated with greatwall.jpg and animated GIF!'
    }
  },
  {
    id: '2012-02-tahoe-dinner',
    systemNumber: 4,
    yearMonth: '2012-02',
    stardate: 'February – April 2012',
    sector: 'Sector 1: The Newlywed Frontier (2011–2012)',
    title: 'Ice Planet Hoth (Tahoe) & Newlywed Date Nights',
    locationName: 'Lake Tahoe & Bay Area, CA',
    coords: { lat: 38.9399, lng: -119.9772 },
    planetTheme: 'ice',
    planetEmoji: '🏔️',
    captainsLog:
      "In early 2012, the crew tested their cold-weather gear in Lake Tahoe (Feb 15, 2012), dressed up for fancy date-night dinners (April 10, 2012), and celebrated a friend's wedding!",
    photos: [
      {
        src: '/photos/2-15-12-tahoe.jpg',
        caption: 'Feb 15, 2012: Snowy adventures in Lake Tahoe!'
      },
      {
        src: '/photos/4-10-12dinner.jpg',
        caption: 'April 10, 2012: Newlywed date night dinner!'
      },
      {
        src: '/photos/2012chriswedding.jpg',
        caption: '2012: Looking sharp at a friend\'s wedding!'
      }
    ],
    meme: {
      title: 'Star Wars: The Empire Strikes Back — Ice Planet Hoth',
      quote: 'Captain, the temperature on Tahoe Hoth is dropping fast—deploy the hot cocoa shields!',
      imageSrc: 'https://static.wikia.nocookie.net/starwars/images/7/75/WampaCave-CWSW365.png/revision/latest?cb=20230718021258',
      hideAudioLinks: true,
      searchQuery: 'Empire Strikes Back Hoth snowspeeder clip',
      suggestionNote: 'Wampa Cave image + 3 photos from Feb/Apr 2012 loaded!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: '3 Facebook photos already attached!',
      boxFolderHint: 'Box.com -> 2012-02 / 2012-04',
      notesForPeter: 'Ready to play!'
    }
  },
  {
    id: '2012-10-pt-cruiser-shelves',
    systemNumber: 5,
    yearMonth: '2012-12',
    stardate: 'Late 2012',
    sector: 'Sector 1: The Newlywed Frontier (2011–2012)',
    title: 'Making Sunnyvale Our Home: PT Cruiser & The Garage Shelves',
    locationName: 'Sunnyvale Home Base',
    coords: { lat: 37.357, lng: -122.0161 },
    planetTheme: 'blue',
    planetEmoji: '🚗',
    captainsLog:
      "In 2012, we truly made Sunnyvale our home! To maximize space in our new home's garage shuttlebay, Chief Engineer Peter built custom overhead shelving right above the legendary PT Cruiser—and Captain Lucinda made sure every storage bin was organized in a neat, tidy row before wrapping up 2012 with a cozy Christmas.",
    photos: [
      {
        src: '/photos/2012garageshelvePTcruiser.jpg',
        caption: '2012: Making Sunnyvale our home — custom garage shelves suspended above the PT Cruiser!'
      },
      {
        src: '/photos/12-20-12-christmas.jpg',
        caption: 'Dec 20, 2012: Cozy Christmas in our Sunnyvale home!'
      }
    ],
    meme: {
      title: 'Home Sweet Home',
      quote: '',
      videoOrGifSrc: 'https://media.istockphoto.com/id/500130528/vector/cross-stitched-home-sweet-home-decoration-with-border-design.jpg?s=612x612&w=0&k=20&c=rYGzX1Fumc59LBn90ZUAQ3-FzJax5kIAZ2yuWTavTGw=',
      hideAudioLinks: true,
      searchQuery: 'Home Sweet Home',
      suggestionNote: 'Home Sweet Home cross-stitch image loaded!'
    },
    interaction: {
      type: 'shelf_organizer',
      miniGameConfig: {
        title: 'Captain Lucinda\'s Garage Shelf Organizer!',
        instruction: 'These 4 storage bins are a total mess! Click each messy box to line them all up in a neat, organized row on the shelf above the PT Cruiser!',
        targetEmoji: '📦',
        playerEmoji: '🚗',
        goalCount: 4,
        victoryMessage: '100% Organized! All 4 boxes are lined up in a crisp, neat row on the Sunnyvale garage shelf!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'PT Cruiser & Christmas 2012 photos already loaded!',
      boxFolderHint: 'Box.com -> 2012-12',
      notesForPeter: 'Ready to play!'
    }
  },

  // ==========================================
  // SECTOR 2: THE NEXT GENERATION (2013-2015)
  // ==========================================
  {
    id: '2013-04-wesley-born',
    systemNumber: 6,
    yearMonth: '2013-04',
    stardate: 'April 15, 2013',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: 'New Crew Member Aboard: Ensign Wesley Arrives on Tax Day!',
    locationName: 'Mountain View / Sunnyvale, CA',
    coords: { lat: 37.3688, lng: -122.0796 },
    planetTheme: 'gold',
    planetEmoji: '👶',
    captainsLog:
      "Stardate 04.15.2013: Right on Tax Day, the U.S.S. Fifteeners welcomed its newest (and loudest) bridge officer: Ensign Wesley! Named in true Starfleet tradition, Wesley immediately took command of the ship's sleep schedule.",
    photos: [
      {
        src: '/photos/4-18-13weslynewborn.jpg',
        caption: 'April 18, 2013: Brand-new Ensign Wesley reporting for duty!'
      },
      {
        src: '/photos/8-28-13cure-wesley.jpg',
        caption: 'August 28, 2013: 4-month-old Wesley turning on maximum cuteness shields!'
      }
    ],
    meme: {
      title: 'Star Trek: The Next Generation — "Wesley!"',
      quote: 'Picard: "Shut up, Wesley!" -> Edited for 3:00 AM: "Please go back to sleep, Wesley!"',
      audioSrc: '/media/shut-up-wesley.mp3',
      searchQuery: 'Star Trek TNG Wesley Crusher bridge scene',
      suggestionNote: 'Classic Star Trek Wesley Crusher audio clip loaded!'
    },
    interaction: {
      type: 'choice',
      prompt: 'Starfleet Bio-Hazard Dilemma: How shall the crew handle the 10-Diapers-A-Day Crisis?',
      choices: [
        {
          label: '🚚 Hail the Starfleet Diaper Service (Weekly Bio-Canister Pickup)',
          outcome: 'Wise choice, Captain! Though nothing could fully prepare the nose shields for the diaper pail.'
        },
        {
          label: '🧺 Wash Our Own Cloth Diapers in the Laundry Torpedo Bay',
          outcome: 'Bold strategy! The washing machine warp core is running at 110% capacity!'
        }
      ]
    },
    curation: {
      status: 'ready',
      photoPrompt: '2 adorable baby Wesley photos already loaded!',
      boxFolderHint: 'Box.com -> 2013-04 & 2013-08',
      notesForPeter: 'Ready to play!'
    }
  },
  {
    id: '2013-10-diaper-monster-battle',
    systemNumber: 7,
    yearMonth: '2013-10',
    stardate: 'October – December 2013',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: 'RED ALERT! Battle Against the Class-5 Diaper Monster & First Tahoe Snow',
    locationName: 'Downtown San Jose, Roaring Camp & South Lake Tahoe',
    coords: { lat: 37.0405, lng: -122.0628 },
    planetTheme: 'crimson',
    planetEmoji: '👾',
    captainsLog:
      "By late 2013, life with baby Wesley was in full swing! Lucinda met up with fellow moms and babies, we dressed Wesley up as baby Yoda, visited the Star Wars exhibit at the Tech Museum in Downtown San Jose on our 2nd Anniversary (Nov 11), celebrated Christmas, and took Wesley on his very first snow trip to South Lake Tahoe for New Year's... all while battling the dreaded Class-5 Diaper Monster & 3 AM Sleep Deprivation!",
    photos: [
      {
        src: '/photos/wesyoda13.jpg',
        caption: '2013: Young Jedi Master Wesley Yoda!'
      },
      {
        src: '/photos/momsandbabies13.jpg',
        caption: '2013: Lucinda and Wesley meeting up with the moms & babies crew!'
      },
      {
        src: '/photos/starwars13.jpg',
        caption: 'Nov 11, 2013: 2nd Anniversary trip to the Star Wars Exhibit in Downtown San Jose!'
      },
      {
        src: '/photos/Christmas13.jpg',
        caption: 'December 2013: Wesley\'s Very First Christmas!'
      },
      {
        src: '/photos/wesSnow13.jpg',
        caption: 'Dec 2013: Baby Wesley in the Lake Tahoe snow!'
      }
    ],
    meme: {
      title: 'RED ALERT',
      quote: 'RED ALERT',
      audioSrc: '/media/red-alert.mp3',
      autoPlayAudioOnOpen: true,
      hideYoutubeLink: true,
      searchQuery: 'Star Trek Red Alert sound',
      suggestionNote: 'Auto-plays Red Alert buzzer MP3 on open with replay button!'
    },
    interaction: {
      type: 'bridge_battle',
      bossName: 'The Class-5 Diaper Monster & 3:00 AM Sleep Wraith',
      bossEmoji: '🧷👾🍼',
      bossSubtitle: 'Shields at 20%! Sleep Reserves at 4%! Captain Lucinda takes the conn!',
      attacks: [
        {
          label: '🔫 Fire Rapid-Wipe Phaser Barrage',
          resultText: 'Direct hit! Captain Lucinda deploys 14 wipes in 2.3 seconds—the Diaper Monster is stunned!'
        },
        {
          label: '🍼 Launch Warm Milk Photon Torpedo',
          resultText: 'Bullseye! Baby Wesley\'s eyelids drop to 50%... 20%... snoring achieved!'
        },
        {
          label: '☕ Reroute Auxiliary Power to Coffee Replicator',
          resultText: 'Caffeine surge restores Captain Lucinda & First Officer Peter\'s sanity shields! Victory!'
        }
      ]
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 5 late-2013 photos & Red Alert MP3 loaded!',
      boxFolderHint: 'Box.com -> 2013-10 or 2013-12',
      notesForPeter: '5 photos + Red Alert sound auto-play loaded!'
    }
  },
  {
    id: '2014-05-wesley-turns-one',
    systemNumber: 8,
    yearMonth: '2014-05',
    stardate: 'Spring 2014',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: 'Wesley\'s Baby Dedication & Promoted to Year One!',
    locationName: 'Lake Tahoe & Sunnyvale, CA',
    coords: { lat: 37.357, lng: -122.0161 },
    planetTheme: 'emerald',
    planetEmoji: '🎂',
    captainsLog:
      "After surviving a full orbit around the sun as parents—including a Valentine's & Presidents' Day weekend trip to Lake Tahoe & Sacramento (Feb 14–17, 2014), celebrating Wesley's special Baby Dedication at church, and Wesley discovering the joys of his very first smoothie—Ensign Wesley officially turned ONE!",
    photos: [
      {
        src: '/photos/babydedication.jpg',
        caption: '2014: Wesley\'s Baby Dedication!'
      },
      {
        src: '/photos/5-7-14-WesAt1.jpg',
        caption: 'May 7, 2014: Wesley at Age 1 — Ready for toddler away missions!'
      },
      {
        src: '/photos/westahoe14.jpg',
        caption: 'Feb 2014: Wesley in Lake Tahoe!'
      },
      {
        src: '/photos/wesSmoothie.jpg',
        caption: '2014: Wesley enjoying his very first smoothie!'
      }
    ],
    meme: {
      title: '2001: A Space Odyssey — "Also Sprach Zarathustra"',
      quote: 'BUM... BUM... BUM... BAAAA-DUM! The baby now walks upright (and drinks smoothies)!',
      hideAudioLinks: true,
      searchQuery: '2001 Space Odyssey theme song fanfare',
      suggestionNote: 'Dramatic fanfare for Wesley turning 1 and becoming a mobile toddler!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'Loaded babydedication.jpg, 5-7-14-WesAt1.jpg, westahoe14.jpg, and wesSmoothie.jpg!',
      boxFolderHint: 'Box.com -> 2014-02 / 2014-04 / 2014-05',
      notesForPeter: '4 photos loaded!'
    }
  },
  {
    id: '2014-07-yosemite-first',
    systemNumber: 9,
    yearMonth: '2014-07',
    stardate: 'July 16–20, 2014',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: 'First Family Away Mission to Planet Yosemite',
    locationName: 'Yosemite National Park, CA',
    coords: { lat: 37.7456, lng: -119.5936 },
    planetTheme: 'emerald',
    planetEmoji: '🌲',
    captainsLog:
      "Stardate 2014.5: Beginning a cherished family tradition that would repeat at least 6 times over the next 12 years, Captain Lucinda, Peter, and 1-year-old Wesley beamed down to the granite cliffs and waterfalls of Yosemite National Park!",
    photos: [
      {
        src: '/photos/7-21-14Lu-wes-wosemite.jpg',
        caption: 'July 2014: Lucinda and Wesley exploring Yosemite National Park!'
      },
      {
        src: '/photos/yosemite14-2.jpg',
        caption: 'July 2014: Family adventure in Yosemite Valley!'
      }
    ],
    meme: {
      title: 'Star Trek V: The Final Frontier — Yosemite',
      quote: 'Captain Kirk climbing El Capitan in Yosemite: "Because it\'s there!"',
      videoOrGifSrc: '/media/climbmtn.mp4',
      hideAudioLinks: true,
      searchQuery: 'Star Trek V Kirk climbing mountain clip',
      suggestionNote: 'Embedded climbmtn.mp4 video clip!'
    },
    interaction: {
      type: 'choice',
      prompt: 'Yosemite Away Team Log: What is the best part of bringing a toddler to Yosemite?',
      choices: [
        {
          label: '🎒 Carrying a 25-pound human up granite trails like Master Yoda',
          outcome: 'Leg day complete! Lucinda and Wesley look amazing in front of the valley!'
        },
        {
          label: '🪨 Watching him ignore Half Dome to play with a small pebble',
          outcome: 'Classic toddler move! That pebble was clearly a rare dilithium crystal.'
        }
      ]
    },
    curation: {
      status: 'ready',
      photoPrompt: '7-21-14Lu-wes-wosemite.jpg & yosemite14-2.jpg loaded + climbmtn.mp4 embedded!',
      boxFolderHint: 'Box.com -> 2014-07',
      notesForPeter: '2 Yosemite photos + embedded climbmtn.mp4 video ready!'
    }
  },
  {
    id: '2014-11-disneyland-first',
    systemNumber: 10,
    yearMonth: '2014-11',
    stardate: 'November 8–11, 2014',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: '3rd Anniversary Mission to Starbase Disneyland!',
    locationName: 'Disneyland Resort, Anaheim, CA',
    coords: { lat: 33.8121, lng: -117.919 },
    planetTheme: 'purple',
    planetEmoji: '🏰',
    captainsLog:
      "To celebrate our 3rd Wedding Anniversary (Nov 8–11, 2014), the crew piloted south to Anaheim for Wesley's very first Disneyland expedition! The undisputed highlight of the trip: Goofy 'kidnapping' Wesley at the restaurant and parading him around to introduce him to every single table because he was the cutest kid in the room!",
    photos: [
      {
        src: '/photos/disney14-1.jpg',
        caption: 'Nov 2014: Wesley\'s First Disneyland Trip!'
      },
      {
        src: '/photos/disney14-2.jpg',
        caption: 'Nov 2014: Exploring Disneyland with Toddler Wesley!'
      },
      {
        src: '/photos/disney14-3.jpg',
        caption: 'Nov 2014: Making magical memories on our 3rd Anniversary trip!'
      },
      {
        src: '/photos/disney14-4.jpg',
        caption: 'Nov 2014: Meeting the characters at Disneyland!'
      },
      {
        src: '/photos/disney14-5.jpg',
        caption: 'Nov 2014: The cutest kid in Disneyland!'
      }
    ],
    meme: {
      title: 'Goofy Kidnaps Wesley!',
      quote: '🚨 CODE GOOFY: Goofy has officially kidnapped Ensign Wesley and is currently introducing him to every single table in the restaurant because he is the cutest kid in the galaxy!',
      hideAudioLinks: true,
      searchQuery: 'Goofy Disneyland character breakfast',
      suggestionNote: 'Goofy kidnapping Wesley story in the meme box!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 5 disney14-1..5.jpg photos loaded!',
      boxFolderHint: 'Box.com -> 2014-11',
      notesForPeter: '5 Disneyland 2014 photos + Goofy story loaded!'
    }
  },
  {
    id: '2014-12-christmas-tree-incident',
    systemNumber: 11,
    yearMonth: '2014-12',
    stardate: 'December 4, 2014',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: 'TIMBER! The Great Christmas Tree Takedown of 2014',
    locationName: 'Sunnyvale Living Room',
    coords: { lat: 37.357, lng: -122.0161 },
    planetTheme: 'crimson',
    planetEmoji: '🎄',
    captainsLog:
      "Stardate 12.04.2014: Structural integrity failure in the living room! Ensure all ornaments are bolted down—19-month-old Toddler Wesley just engaged tractor-beam hands and pulled the Christmas tree straight to the floor!",
    photos: [
      {
        src: '/photos/12-4-14-WesknockdownChristmasTree.jpg',
        caption: 'Dec 4, 2014: The crime scene — Wesley vs. The Christmas Tree (Wesley won)!'
      }
    ],
    meme: {
      title: '',
      quote: '',
      hidden: true,
      searchQuery: '',
      suggestionNote: 'Meme hidden per user request'
    },
    interaction: {
      type: 'shelf_organizer',
      miniGameConfig: {
        title: 'Emergency Christmas Tree & Ornament Tidy-Up!',
        instruction: 'Toddler Wesley pulled the Christmas trees & ornaments down! Click each knocked-over tree to stand them upright in a neat, organized row!',
        targetEmoji: '🎄',
        playerEmoji: '🙌',
        neatLabelPrefix: 'TREE',
        bottomBannerText: '👶 Toddler Wesley (Tractor-Beam Hands Disarmed!)',
        goalCount: 4,
        victoryMessage: 'Tree uprighted, ornaments lined up neatly, and secured with heavy-duty Starfleet tether cables!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: '12-4-14-WesknockdownChristmasTree.jpg is loaded!',
      boxFolderHint: 'Box.com -> 2014-12',
      notesForPeter: 'Ready!'
    }
  },
  {
    id: '2015-07-yosemite-babymoon',
    systemNumber: 12,
    yearMonth: '2015-07',
    stardate: 'July 5–11, 2015',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: 'Father-Son Yosemite Expedition (And a Well-Earned Rest for Captain Lu!)',
    locationName: 'Yosemite National Park & Sunnyvale Home Base',
    coords: { lat: 37.7409, lng: -119.5795 },
    planetTheme: 'emerald',
    planetEmoji: '🏞️',
    captainsLog:
      "After fun 2015 family adventures at Happy Hollow Park & Zoo, by July 2015 Captain Lucinda was 8 months pregnant with Ben—so First Officer Peter took 2-year-old Ensign Wesley on a solo father-son expedition to Yosemite National Park (July 5–11), giving Lucinda a peaceful, well-deserved week of rest and quiet back at Sunnyvale Home Base before baby #2 arrived!",
    photos: [
      {
        src: '/photos/yosemite15.jpg',
        caption: 'July 2015: Father-son Yosemite adventure while 8-months-pregnant Lucinda got a well-deserved rest at home!'
      },
      {
        src: '/photos/yosemite15-2.jpg',
        caption: 'July 2015: Peter and Wesley exploring Yosemite National Park!'
      },
      {
        src: '/photos/haphollo15.jpg',
        caption: '2015: Fun family adventures at Happy Hollow Park & Zoo!'
      },
      {
        src: '/photos/haphollo15-2.jpg',
        caption: '2015: Exploring Happy Hollow together!'
      }
    ],
    meme: {
      title: 'Wicket the Ewok in the Yosemite Woods',
      quote: 'Away Team Alpha (Peter & Toddler Wesley): Conquering Yosemite Valley! Starbase Command (8-Months-Pregnant Captain Lucinda): Enjoying 100% peaceful silence and a well-earned rest at home!',
      videoOrGifSrc: '/photos/wicket-ohh-my.gif',
      hideAudioLinks: true,
      searchQuery: 'Star Wars Ewok Wicket',
      suggestionNote: 'wicket-ohh-my.gif loaded!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'yosemite15.jpg, yosemite15-2.jpg, haphollo15.jpg, and haphollo15-2.jpg loaded!',
      boxFolderHint: 'Box.com -> 2015-01 / 2015-07',
      notesForPeter: '4 photos from 2015 Yosemite & Happy Hollow loaded!'
    }
  },
  {
    id: '2015-08-ben-born',
    systemNumber: 13,
    yearMonth: '2015-08',
    stardate: 'August 10, 2015',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: 'Cadet Ben Joins the Fleet! ("Now There Are Two of Them!")',
    locationName: 'Mountain View / Sunnyvale, CA',
    coords: { lat: 37.357, lng: -122.0161 },
    planetTheme: 'gold',
    planetEmoji: '👶👶',
    captainsLog:
      "Stardate 08.10.2015: Cadet Ben beamed aboard! Big brother Wesley inspected the new recruit closely. The U.S.S. Fifteeners officially switched from 'Man-to-Man Defense' to 'Zone Defense'!",
    photos: [
      {
        src: '/photos/benbirth.jpg',
        caption: 'August 10, 2015: Welcome to the galaxy, Cadet Ben!'
      },
      {
        src: '/photos/benbirth2.jpg',
        caption: 'August 2015: Newborn Baby Ben!'
      },
      {
        src: '/photos/8-21-15firstWEs-ben.jpg',
        caption: 'August 21, 2015: Big Brother Wesley & Newborn Baby Ben!'
      }
    ],
    meme: {
      title: 'Star Wars Episode I — Viceroy Nute Gunray',
      quote: 'This is getting out of hand! Now, there are two of them!',
      audioSrc: '/media/now-there-are-two-of-them.mp3',
      autoPlayAudioOnOpen: true,
      hideYoutubeLink: true,
      searchQuery: 'This is getting out of hand now there are two of them Star Wars clip',
      suggestionNote: 'Auto-plays now-there-are-two-of-them.mp3 on open with replay button!'
    },
    interaction: {
      type: 'shelf_organizer',
      miniGameConfig: {
        title: 'Double Trouble: Two-Kid Bottle Line-Up!',
        instruction: 'Now there are TWO of them! Click each messy baby bottle to line all 4 up in a neat, organized row for Wesley & Ben!',
        targetEmoji: '🍼',
        playerEmoji: '🖖',
        neatLabelPrefix: 'BOTTLE',
        bottomBannerText: '👶👶 Big Brother Wesley & Newborn Baby Ben',
        goalCount: 4,
        victoryMessage: 'All 4 bottles lined up neatly! Both boys fed, burped, and swaddled!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'benbirth.jpg, benbirth2.jpg, and 8-21-15firstWEs-ben.jpg loaded!',
      boxFolderHint: 'Box.com -> 2015-08',
      notesForPeter: '3 photos + now-there-are-two-of-them.mp3 auto-play loaded!'
    }
  },
  {
    id: '2015-11-monterey-aquarium',
    systemNumber: 14,
    yearMonth: '2015-11',
    stardate: 'October & November 2015',
    sector: 'Sector 2: The Next Generation (2013–2015)',
    title: 'Monterey Bay Aquarium & Thanksgiving Mission with Baby Ben',
    locationName: 'Monterey Bay Aquarium & Pacific Grove, CA',
    coords: { lat: 36.6183, lng: -121.9015 },
    planetTheme: 'blue',
    planetEmoji: '🐋',
    captainsLog:
      "In October and November 2015, we took 2-year-old Wesley and newborn Ben down the coast to the Monterey Bay Aquarium—known to all Star Trek fans as the Cetacean Institute from Star Trek IV: The Voyage Home! Later that November, when Wesley came down sick right on Thanksgiving, Peter took little Baby Ben solo to family Thanksgiving while Lucinda cared for Wesley at home.",
    photos: [
      {
        src: '/photos/aquarium15.jpg',
        caption: 'Autumn 2015: Visiting the Monterey Bay Aquarium!'
      },
      {
        src: '/photos/thanksg15.jpg',
        caption: 'Thanksgiving 2015: Peter taking little Baby Ben to family Thanksgiving while Wesley was sick at home!'
      }
    ],
    meme: {
      title: 'Star Trek IV: The Voyage Home',
      quote: '',
      videoOrGifSrc: '/photos/spockwhale.jpg',
      hideAudioLinks: true,
      searchQuery: 'Star Trek IV Admiral there be whales here Monterey Aquarium clip',
      suggestionNote: 'spockwhale.jpg image only, no text or buttons!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'aquarium15.jpg and thanksg15.jpg loaded + spockwhale.jpg meme!',
      boxFolderHint: 'Box.com -> 2015-10 or 2015-11',
      notesForPeter: '2 photos + Spock whale meme image loaded!'
    }
  },

  // ==========================================
  // SECTOR 3: TWO BOYS & THE BIG MOVE (2016-2019)
  // ==========================================
  {
    id: '2016-05-totem-pole-tahoe',
    systemNumber: 15,
    yearMonth: '2016-07',
    stardate: 'May – November 2016',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: 'Totem Poles, Uncle EE\'s Wedding (Ben\'s First Steps!) & 5th Anniversary',
    locationName: 'La Honda Redwoods, Half Moon Bay & San Francisco, CA',
    coords: { lat: 37.2757, lng: -122.2911 },
    planetTheme: 'gold',
    planetEmoji: '🗿',
    captainsLog:
      "2016 was packed with unforgettable milestones! We stacked up like a family totem pole in May, and on July 23 we celebrated Uncle EE's wedding in the Santa Cruz Mountains redwoods (Loma Mar / La Honda)—where Wesley was in the wedding party and 11-month-old Ben decided he wanted to walk and took his very first steps! In November, Peter and Lucinda celebrated our 5th Wedding Anniversary (Nov 11) with a coastal getaway to Half Moon Bay & Pillar Point Harbor, followed by taking the boys to the Steinhart Aquarium at the California Academy of Sciences in San Francisco (Nov 21).",
    photos: [
      {
        src: '/photos/5-21-16triceTotempole.jpg',
        caption: 'May 21, 2016: The legendary Family Totem Pole stack!'
      },
      {
        src: '/photos/eewedding16.jpg',
        caption: 'July 23, 2016: Uncle EE\'s Wedding in the redwoods — Wesley was in the wedding and Ben took his very first steps!'
      },
      {
        src: '/photos/pete_lu_20161111_131936.jpg',
        caption: 'Nov 11, 2016: Happy 5th Anniversary! Coastal date trip to Half Moon Bay & Pillar Point Harbor!'
      },
      {
        src: '/photos/boys_20161121_110257.jpg',
        caption: 'Nov 21, 2016: Wesley & Ben mesmerizingly watching the fish tank at the California Academy of Sciences (SF)!'
      }
    ],
    meme: {
      title: 'Voltron: Defender of the Universe',
      quote: 'Form Voltron! Stack the small humans on top of the tall humans!',
      imageSrc: '/photos/formvoltron.jpg',
      hideAudioLinks: true,
      searchQuery: 'Voltron assemble transformation clip',
      suggestionNote: 'formvoltron.jpg image loaded without buttons!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 4 photos (Totem Pole, Uncle EE wedding, 5th Anniversary Half Moon Bay, Cal Academy of Sciences) + formvoltron.jpg loaded!',
      boxFolderHint: 'Box.com -> 2016-05 / 2016-07 / 2016-11',
      notesForPeter: '4 photos + formvoltron.jpg loaded!'
    }
  },
  {
    id: '2017-01-sleeping-disneyland',
    systemNumber: 16,
    yearMonth: '2017-04',
    stardate: '2017',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: 'Cryo-Stasis Naps, Disneyland, Yosemite & Christmas Train!',
    locationName: 'Disneyland, Yosemite & Redwood City, CA',
    coords: { lat: 33.8075, lng: -117.915 },
    planetTheme: 'purple',
    planetEmoji: '😴',
    captainsLog:
      "2017 was a year of big family adventures—and legendary naps! Whether it was Lucinda and Wesley snoozing together at home in January or Lucinda catching a glorious recliner nap in Yosemite in July, the Captain knew how to recharge between away missions. In April, all four of us warped down to Disneyland (Ben's first big trip!), in July the boys explored Yosemite National Park, in September we visited the Hiller Aviation Museum (Sep 23), and on December 2 we rode Caltrain up to Redwood City for Christmas in Courthouse Square!",
    photos: [
      {
        src: '/photos/1-18-17-Wes-lu-sleeping.jpg',
        caption: 'Jan 18, 2017: Captain Lucinda & Ensign Wesley in peaceful Cryo-Sleep!'
      },
      {
        src: '/photos/yosemite17nap.jpg',
        caption: 'July 2017: Cryo-Sleep Part II — Lucinda catching a well-earned recliner nap in Yosemite!'
      },
      {
        src: '/photos/disney17.jpg',
        caption: 'April 2017: Family expedition to Disneyland!'
      },
      {
        src: '/photos/yosemite17.jpg',
        caption: 'July 2017: Wesley & Ben in Yosemite National Park!'
      },
      {
        src: '/photos/hiller20170923_112205.jpg',
        caption: 'Sep 23, 2017: Exploring aircraft at the Hiller Aviation Museum!'
      },
      {
        src: '/photos/boystrain2017.jpg',
        caption: 'Dec 2, 2017: Wesley & Ben riding Caltrain to Redwood City for Christmas in the Square!'
      }
    ],
    meme: {
      title: 'The Lion King — "The Lion Sleeps Tonight" (Wimoweh)',
      quote: 'Shhhh! Do not make a sound—whether at home or on a recliner in Yosemite, Captain Lucinda is in peaceful Cryo-Sleep!',
      audioSrc: '/media/inthejungle.mp3',
      autoPlayAudioOnOpen: true,
      hideYoutubeLink: true,
      searchQuery: 'The Lion Sleeps Tonight a-weema-weh clip',
      suggestionNote: 'Auto-plays inthejungle.mp3 on open with replay button!'
    },
    interaction: {
      type: 'tricorder_scan',
      miniGameConfig: {
        title: 'Stealth Mission: Tip-Toe Past Sleeping Lucinda & Wesley!',
        instruction: 'Click gently to engage Silent Cloaking Device and sneak out of the room without waking them!',
        targetEmoji: '🤫',
        goalCount: 3,
        victoryMessage: 'Cloaking successful! Noise level 0 decibels—they didn\'t wake up!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 5 2017 photos (2 naps, Disneyland, Yosemite, Redwood City train) + inthejungle.mp3 loaded!',
      boxFolderHint: 'Box.com -> 2017-01 / 2017-04 / 2017-07 / 2017-12',
      notesForPeter: '5 photos + inthejungle.mp3 auto-play loaded!'
    }
  },
  {
    id: '2018-01-christmas-parties-tahoe',
    systemNumber: 17,
    yearMonth: '2018-01',
    stardate: 'January 5 & December 19, 2018',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: 'Starfleet Officers\' Dress Uniform Galas (Two Christmas Parties in One Year!)',
    locationName: 'Bay Area, CA',
    coords: { lat: 37.357, lng: -122.0161 },
    planetTheme: 'gold',
    planetEmoji: '🥂',
    captainsLog:
      "In 2018, Captain Lucinda and First Officer Peter bookended the year with two glamorous Company Christmas Parties—kicking off the year in high style on January 5, 2018, and dressing to the nines again on December 19, 2018!",
    photos: [
      {
        src: '/photos/1-5-18-CompanyChristmasparty.jpg',
        caption: 'Jan 5, 2018: Dressed to the nines at the Company Christmas Party!'
      },
      {
        src: '/photos/12-19-18CompanyChristmas2.jpg',
        caption: 'Dec 19, 2018: Another glamorous Holiday Gala together to close out 2018!'
      }
    ],
    meme: {
      title: 'James Bond 007 Theme / Star Trek Dress Uniforms',
      quote: 'Look! Actual proof that Peter and Lucinda own clothes that aren\'t covered in goldfish crackers!',
      hideAudioLinks: true,
      searchQuery: 'James Bond theme song',
      suggestionNote: 'Both 2018 Company Christmas party photos loaded with text-only meme!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'Both 2018 gala photos of Peter & Lucinda are loaded!',
      boxFolderHint: 'Box.com -> 2018-01 / 2018-12',
      notesForPeter: 'Ready!'
    }
  },
  {
    id: '2018-07-moving-houses',
    systemNumber: 18,
    yearMonth: '2018-07',
    stardate: 'July – October 2018',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: 'PIVOT! Moving to Cupertino & Wesley Starts Kindergarten!',
    locationName: 'Sunnyvale -> Cupertino Home Base',
    coords: { lat: 37.3169, lng: -122.0256 },
    planetTheme: 'gold',
    planetEmoji: '🏡',
    captainsLog:
      "Stardate 07.20.2018: After nearly 7 wonderful years at our Sunnyvale house, the crew emptied out every room, packed every box, and relocated our Starbase HQ to Cupertino! One of the main reasons for our move was to be close to Eaton Elementary School, where Ensign Wesley officially started Kindergarten while Ben settled right into the new Cupertino house!",
    photos: [
      {
        src: '/photos/movingempty.jpg',
        caption: 'July 2018: The Sunnyvale house completely emptied out on moving day!'
      },
      {
        src: '/photos/wesKinder.jpg',
        caption: '2018: Wesley starting Kindergarten at Eaton Elementary School!'
      },
      {
        src: '/photos/ben_cup20181031_094943.jpg',
        caption: 'Oct 31, 2018: Ben at our new Cupertino house!'
      }
    ],
    meme: {
      title: 'Friends — Ross Geller Moving the Couch',
      quote: '',
      videoOrGifSrc: '/photos/pivot.gif',
      hideAudioLinks: true,
      searchQuery: 'Friends Ross Pivot couch scene clip',
      suggestionNote: 'Tenor PIVOT GIF loaded with no text or buttons!'
    },
    interaction: {
      type: 'shuttle_jump',
      miniGameConfig: {
        title: 'Highway 85 Moving Truck Run!',
        instruction: 'Press SPACE or Click/Tap to jump the Moving Van over runaway cardboard boxes on the way to the new Cupertino house!',
        targetEmoji: '📦',
        playerEmoji: '🚚',
        goalCount: 6,
        victoryMessage: 'All boxes delivered to Cupertino! Welcome to your new Starbase HQ!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'movingempty.jpg, wesKinder.jpg, and ben_cup20181031_094943.jpg + pivot.gif loaded!',
      boxFolderHint: 'Box.com -> 2018-07 / 2018-08 / 2018-10',
      notesForPeter: '3 photos + PIVOT GIF loaded!'
    }
  },
  {
    id: '2018-08-pinecrest-disneyland',
    systemNumber: 19,
    yearMonth: '2018-11',
    stardate: '2018 Travels Recap',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: '2018 Travels Recap: Tahoe Trout Fishing, Happy Hollow, La Brea Tar Pits & Disneyland!',
    locationName: 'Lake Tahoe, San Jose, Los Angeles & Disneyland, CA',
    coords: { lat: 33.8121, lng: -117.919 },
    planetTheme: 'sunset',
    planetEmoji: '🎢',
    captainsLog:
      "Even with a major house move in 2018, the U.S.S. Fifteeners logged an incredible year of family travels and outings: visiting Happy Hollow Park & Zoo (Apr 20), trout fishing in Lake Tahoe in August, a Thanksgiving week road trip down to Los Angeles—stopping at the La Brea Tar Pits on November 18—and Disneyland (Nov 17–21), plus holiday adventures at California's Great America (Dec 27) and The Tech Museum!",
    photos: [
      {
        src: '/photos/troutfish18.jpg',
        caption: 'August 2018: Trout fishing adventure in Lake Tahoe!'
      },
      {
        src: '/photos/haphollo18.jpg',
        caption: 'April 2018: Family outing to Happy Hollow Park & Zoo!'
      },
      {
        src: '/photos/brea20181118_102641.jpg',
        caption: 'Nov 18, 2018: Exploring the La Brea Tar Pits in Los Angeles!'
      },
      {
        src: '/photos/disney18.jpg',
        caption: 'Nov 2018: Thanksgiving week family trip to Disneyland!'
      },
      {
        src: '/photos/techmus.jpg',
        caption: 'Dec 2018: Hands-on fun at The Tech Museum in Downtown San Jose!'
      }
    ],
    meme: {
      title: 'National Lampoon\'s Vacation',
      quote: '',
      videoOrGifSrc: '/photos/vacationcar.jpg',
      hideAudioLinks: true,
      searchQuery: 'Lindsey Buckingham Holiday Road clip',
      suggestionNote: 'vacationcar.jpg image only, no text or buttons!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 6 2018 travel photos + vacationcar.jpg loaded!',
      boxFolderHint: 'Box.com -> 2018-04 / 2018-08 / 2018-11 / 2018-12',
      notesForPeter: '6 photos loaded!'
    }
  },
  {
    id: '2019-04-san-diego',
    systemNumber: 20,
    yearMonth: '2019-04',
    stardate: 'April 13–17, 2019',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: 'Shuttle Flight to San Diego & LEGOLAND!',
    locationName: 'LEGOLAND & San Diego, CA',
    coords: { lat: 33.1264, lng: -117.3115 },
    planetTheme: 'sunset',
    planetEmoji: '✈️',
    captainsLog:
      "In April 2019 (April 13–17), the crew boarded a shuttle flight down to San Diego—with LEGOLAND as the main destination of our mission! Ben got behind the wheel to drive his own car and posed with LEGO Master Yoda, and we soaked up the sunshine on the San Diego beach!",
    photos: [
      {
        src: '/photos/legoland20190414_174918.jpg',
        caption: 'April 14, 2019: Cadet Ben behind the wheel driving a car at LEGOLAND!'
      },
      {
        src: '/photos/legoland2.png',
        caption: 'April 2019: Ben with LEGO Master Yoda at LEGOLAND!'
      },
      {
        src: '/photos/benbeach.png',
        caption: 'April 2019: Playing on the beach in San Diego!'
      }
    ],
    meme: {
      title: 'Top Gun — "Danger Zone"',
      quote: 'Highway to the Danger Zone! Flying into San Diego airspace—and letting Cadet Ben behind the wheel at LEGOLAND!',
      audioSrc: '/media/danger_2.mp3',
      autoPlayAudioOnOpen: true,
      hideYoutubeLink: true,
      searchQuery: 'Top Gun Danger Zone clip',
      suggestionNote: 'Auto-plays danger_2.mp3 on open with replay button!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'legoland20190414_174918.jpg, legoland2.png, and benbeach.png + danger_2.mp3 loaded!',
      boxFolderHint: 'Box.com -> 2019-04',
      notesForPeter: '3 San Diego / Legoland photos + Danger Zone MP3 loaded!'
    }
  },
  {
    id: '2019-05-ben-pneumonia-hospital',
    systemNumber: 21,
    yearMonth: '2019-05',
    stardate: 'May 27–29, 2019',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: '"In Sickness and In Health" Part I: Cadet Ben at El Camino Sickbay',
    locationName: 'El Camino Hospital, Mountain View, CA',
    coords: { lat: 37.3691, lng: -122.0796 },
    planetTheme: 'blue',
    planetEmoji: '🏥',
    captainsLog:
      "Stardate 05.28.2019: Just days after a family hike in Point Reyes/Muir Woods, 3-year-old Cadet Ben came down with pneumonia, requiring three back-to-back hospital visits and a 15-hour overnight stay at El Camino Hospital. Through scary nights and beeping monitors, Captain Lucinda and First Officer Peter stood watch side by side.",
    photos: [
      {
        src: '/photos/sickben19.jpg',
        caption: 'May 2019: Brave Cadet Ben in the hospital — still looking cute!'
      }
    ],
    meme: {
      title: 'Star Trek — Dr. "Bones" McCoy Medical Tricorder',
      quote: 'Dammit Jim, I\'m a parent, not a pulmonologist! ... Raising deflector shields around Cadet Ben!',
      hideAudioLinks: true,
      searchQuery: 'Star Trek Bones McCoy medical tricorder sound effect',
      suggestionNote: 'sickben19.jpg loaded with text-only meme!'
    },
    interaction: {
      type: 'tricorder_scan',
      miniGameConfig: {
        title: 'Starfleet Sickbay: Restore Cadet Ben\'s Shields to 100%!',
        instruction: 'Click to administer Starfleet Nebulizer Shields, Antibiotics & Parent Cuddles until Ben is 100% healed!',
        targetEmoji: '💙',
        goalCount: 4,
        victoryMessage: 'Cadet Ben\'s oxygen and energy levels restored to 100%! Ready for Hong Kong next month!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'sickben19.jpg loaded!',
      boxFolderHint: 'Box.com -> 2019-05',
      notesForPeter: 'sickben19.jpg loaded!'
    }
  },
  {
    id: '2019-06-wet-hong-kong',
    systemNumber: 22,
    yearMonth: '2019-06',
    stardate: 'June 25 – July 4, 2019',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: 'The Monsoon Expedition: Soaked in Hong Kong!',
    locationName: 'Hong Kong',
    coords: { lat: 22.313, lng: 113.914 },
    planetTheme: 'blue',
    planetEmoji: '🌧️',
    captainsLog:
      "One month after Ben recovered, the crew flew across the Pacific for a 9-day adventure in Hong Kong (June 25–July 4, 2019)! When the tropical skies opened up in a torrential downpour on June 27, it made for one of the best soaked selfies of our entire 15-year mission! We also explored a Hong Kong mall with Aunt Sunny (July 2), and by the time we boarded our flight home on July 4, the boys were completely knocked out after a busy, unforgettable trip!",
    photos: [
      {
        src: '/photos/6-27-19-WEtHongKong.jpg',
        caption: 'June 27, 2019: Absolutely drenched in Hong Kong — and still smiling!'
      },
      {
        src: '/photos/HKmall20190702_105323.jpg',
        caption: 'July 2, 2019: Exploring a Hong Kong mall with Aunt Sunny!'
      },
      {
        src: '/photos/hkflightsleep20190704_232235.jpg',
        caption: 'July 4, 2019: Sound asleep on the flight home after a busy Hong Kong trip!'
      }
    ],
    meme: {
      title: '',
      quote: '',
      hidden: true,
      searchQuery: '',
      suggestionNote: 'Meme hidden per user request'
    },
    interaction: {
      type: 'choice',
      prompt: 'Monsoon Protocol in Hong Kong: Rain is coming down at 10 inches per hour!',
      choices: [
        {
          label: '🤳 Embrace the Monsoon & Take the Legendary Wet Selfie',
          outcome: 'Clothes: 100% soaked. Memories: 100% waterproof!'
        },
        {
          label: '🥟 Duck into the nearest mall with Aunt Sunny to dry off',
          outcome: 'Dry clothes, shopping, and delicious food restore crew morale immediately!'
        }
      ]
    },
    curation: {
      status: 'ready',
      photoPrompt: '6-27-19-WEtHongKong.jpg, HKmall20190702_105323.jpg, and hkflightsleep20190704_232235.jpg loaded!',
      boxFolderHint: 'Box.com -> 2019-06 / 2019-07',
      notesForPeter: '3 Hong Kong 2019 photos loaded!'
    }
  },
  {
    id: '2019-08-gilroy-gardens-tahoe',
    systemNumber: 23,
    yearMonth: '2019-08',
    stardate: 'August – November 2019',
    sector: 'Sector 3: Two Boys & The Big Move (2016–2019)',
    title: 'The Gilroy Gardens Garlic Era & Double Tahoe Autumn',
    locationName: 'Gilroy Gardens & South Lake Tahoe, CA',
    coords: { lat: 37.0058, lng: -121.6295 },
    planetTheme: 'emerald',
    planetEmoji: '🧄',
    captainsLog:
      "Late 2019 was peak theme-park and mountain season: three trips to Gilroy Gardens (Jan 4, Aug 17, Aug 31), visits to Great America and the Children's Discovery Museum, plus BOTH an October foliage weekend (Oct 11–14) and Thanksgiving snow trip (Nov 26–29) in Lake Tahoe!",
    photos: [
      {
        src: '/photos/gilroyg20190831_143427.jpg',
        caption: 'Aug 31, 2019: Peter & Wesley riding a coaster at Gilroy Gardens!'
      }
    ],
    meme: {
      title: 'Star Trek: TNG — Circus Trees & Garlic Coasters',
      quote: 'Captain, sensors detect giant spinning garlic bulbs and trees tied into knots in Gilroy!',
      hideAudioLinks: true,
      searchQuery: 'Gilroy Gardens Banana Split coaster or Circus Trees',
      suggestionNote: 'gilroyg20190831_143427.jpg & relaxingtahoe20191127_161119.jpg loaded with text-only meme!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'gilroyg20190831_143427.jpg and relaxingtahoe20191127_161119.jpg loaded!',
      boxFolderHint: 'Box.com -> 2019-08 or 2019-11',
      notesForPeter: '2 photos loaded!'
    }
  },

  // ==========================================
  // SECTOR 4: LOCKDOWN NEBULA & BREAKOUT (2020-2022)
  // ==========================================
  {
    id: '2020-02-disneyland-before-lockdown',
    systemNumber: 24,
    yearMonth: '2020-02',
    stardate: 'February 16–20, 2020',
    sector: 'Sector 4: Lockdown Nebula & Breakout (2020–2022)',
    title: 'The Indiana Jones Slide: Disneyland 3 Weeks Before Lockdown!',
    locationName: 'Disneyland Resort, Anaheim, CA',
    coords: { lat: 33.804, lng: -117.915 },
    planetTheme: 'purple',
    planetEmoji: '🎩',
    captainsLog:
      "Talk about impeccable Starfleet timing! From February 16–20, 2020, we took a 5-day family vacation to Disneyland—where Ben discovered hidden treasure on Tom Sawyer Island and feasted on giant cotton candy—sliding under the blast doors literally THREE WEEKS before the entire planet shut down in March 2020!",
    photos: [
      {
        src: '/photos/tomStreasureIMG_20200219_110607.jpg',
        caption: 'Feb 19, 2020: Ben discovering treasure on Tom Sawyer Island at Disneyland!'
      },
      {
        src: '/photos/disneybenIMG_20200219_174631.jpg',
        caption: 'Feb 19, 2020: Ben enjoying cotton candy at Disneyland!'
      }
    ],
    meme: {
      title: 'Indiana Jones — Sliding Under the Closing Stone Door',
      quote: 'Cue Indiana Jones sliding under the stone door and grabbing his hat at the last millisecond before March 2020!',
      imageSrc: '/photos/indiana-jones-door-close.gif',
      hideAudioLinks: true,
      searchQuery: 'Indiana Jones sliding under door hat clip',
      suggestionNote: 'indiana-jones-door-close.gif loaded without sound buttons!'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'tomStreasureIMG_20200219_110607.jpg and disneybenIMG_20200219_174631.jpg + indiana-jones-door-close.gif loaded!',
      boxFolderHint: 'Box.com -> 2020-02',
      notesForPeter: '2 photos + Indiana Jones GIF loaded!'
    }
  },
  {
    id: '2020-04-quarantine-nebula',
    systemNumber: 25,
    yearMonth: '2020-04',
    stardate: 'March – November 2020',
    sector: 'Sector 4: Lockdown Nebula & Breakout (2020–2022)',
    title: 'Trapped in the 2020 Quarantine Anomaly (Zoom School Boss Fight!)',
    locationName: 'Cupertino Home Starbase & Fremont Older Preserve',
    coords: { lat: 37.3169, lng: -122.0256 },
    planetTheme: 'crimson',
    planetEmoji: '😷',
    captainsLog:
      "Stardate 2020.3: In March 2020, the entire planet went into lockdown! Inside Starbase Cupertino, Lucinda helped get Ben online for Zoom preschool (Mar 30), Lucinda and Ben perfected the art of staying home and staying cozy in bed (Jun 3), Ben celebrated his masked last day of preschool (Jun 10), and the crew ventured out for masked outdoor hikes at Fremont Older Open Space Preserve (Nov 28)!",
    photos: [
      {
        src: '/photos/zoomschoolIMG_20200330_092617.jpg',
        caption: 'March 30, 2020: Lucinda getting Ben online for Zoom preschool!'
      },
      {
        src: '/photos/stayinghomeIMG_20200603_135428.jpg',
        caption: 'June 3, 2020: Lucinda & Ben staying home and staying cozy in bed during 2020!'
      },
      {
        src: '/photos/benlastPreschoolIMG_20200610_160448.jpg',
        caption: 'June 10, 2020: Ben\'s masked last day of preschool!'
      },
      {
        src: '/photos/hikePXL_20201128_232629642.jpg',
        caption: 'Nov 28, 2020: Masked family hike at Fremont Older Open Space Preserve!'
      }
    ],
    meme: {
      title: 'SpongeBob Time Card: "2,000 Years Later..." / Star Trek "Cause and Effect"',
      quote: '"You\'re on mute! Unmute your iPad!" — "2,000 Years Later..."',
      hideAudioLinks: true,
      searchQuery: 'Spongebob 2000 years later narrator clip',
      suggestionNote: '4 photos from 2020 loaded!'
    },
    interaction: {
      type: 'bridge_battle',
      bossName: 'The Quarantine Zoom-School Borg Cube',
      bossEmoji: '💻🦠🧻',
      bossSubtitle: '"WE ARE ZOOM. YOU WILL BE MUTED. RESISTANCE IS FUTILE."',
      attacks: [
        {
          label: '🔇 Unmute the Kids\' Chromebooks & Reboot Wi-Fi',
          resultText: 'Router power-cycled! Bandwidth restored across all 4 simultaneous video calls!'
        },
        {
          label: '🍞 Replicate Sourdough Bread & Backyard Games',
          resultText: 'Crew morale boosted by +500! The Quarantine Borg Cube is retreating!'
        },
        {
          label: '💉 Engage 2021 Vaccine Shields & Break Orbit',
          resultText: 'Warp engines back online! The U.S.S. Fifteeners is free to travel the galaxy again!'
        }
      ]
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 4 2020 lockdown/Zoom school/Fremont Older hike photos loaded!',
      boxFolderHint: 'Box.com -> 2020-03 / 2020-06 / 2020-11',
      notesForPeter: '4 photos loaded!'
    }
  },
  {
    id: '2021-09-san-diego-great-wolf',
    systemNumber: 26,
    yearMonth: '2021-08',
    stardate: 'July – December 2021',
    sector: 'Sector 4: Lockdown Nebula & Breakout (2020–2022)',
    title: '2021 Breakout: SF Zoo, Gilroy Gardens, Cousin Crew & Great Wolf Lodge!',
    locationName: 'San Francisco Zoo, Gilroy Gardens & Great Wolf Lodge, CA',
    coords: { lat: 37.7329, lng: -122.503 },
    planetTheme: 'blue',
    planetEmoji: '🐺',
    captainsLog:
      "In 2021—our 10th Wedding Anniversary year!—the crew broke out of lockdown with a day at the San Francisco Zoo with Grandma and Grandpa (July 31), rides at Gilroy Gardens (Aug 14) and Great America, a weekend flight to San Diego (Sept 24–26), celebrating Christmas with the whole cousin crew (Dec 5), and a post-Christmas splashdown at Great Wolf Lodge indoor waterpark in Manteca (Dec 26–28)!",
    photos: [
      {
        src: '/photos/PXL_20210814_193139918.MP.jpg',
        caption: 'Aug 14, 2021: Summer fun at Gilroy Gardens!'
      },
      {
        src: '/photos/PXL_20211205_015133470.MP.jpg',
        caption: 'Dec 2021: The Cousin Crew together at Christmas!'
      }
    ],
    meme: {
      title: '',
      quote: '',
      hidden: true,
      searchQuery: '',
      suggestionNote: 'Meme hidden per user request'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'PXL_20210731_200356088.MP.jpg, PXL_20210814_193139918.MP.jpg, and PXL_20211205_015133470.MP.jpg loaded!',
      boxFolderHint: 'Box.com -> 2021-07 / 2021-08 / 2021-12',
      notesForPeter: '3 photos from 2021 loaded!'
    }
  },
  {
    id: '2022-02-tahoe-ski-week',
    systemNumber: 27,
    yearMonth: '2022-02',
    stardate: '2022',
    sector: 'Sector 4: Lockdown Nebula & Breakout (2020–2022)',
    title: '2022 Adventures: Tahoe with Cousins, Great America, Millennium Falcon & Family Thanksgiving!',
    locationName: 'Lake Tahoe, Great America & Disneyland, CA',
    coords: { lat: 38.911, lng: -120.004 },
    planetTheme: 'ice',
    planetEmoji: '⛷️',
    captainsLog:
      "2022 was packed with unforgettable family adventures! In February (Feb 19–25), the boys and their cousins spent a winter week together at a cabin in Lake Tahoe playing in the snow. Throughout the year we visited California's Great America five times, warped down to Disneyland in summer where Wesley piloted the Millennium Falcon (July 1), and gathered the whole family together for Thanksgiving dinner!",
    photos: [
      {
        src: '/photos/20220224_155836.jpg',
        caption: 'Feb 24, 2022: The boys and their cousins hanging out at the Lake Tahoe cabin!'
      },
      {
        src: '/photos/20220224_104333.jpg',
        caption: 'Feb 24, 2022: Ben and his cousin playing in the Lake Tahoe snow!'
      },
      {
        src: '/photos/greatamer22.jpg',
        caption: '2022: Theme park fun at California\'s Great America!'
      },
      {
        src: '/photos/GA-PXL_20220811_182315527.MP.jpg',
        caption: 'Aug 11, 2022: Lucinda and the boys on a bench at California\'s Great America!'
      },
      {
        src: '/photos/PXL_20220701_015859948.MP.jpg',
        caption: 'July 1, 2022: Wesley aboard the Millennium Falcon at Disneyland!'
      },
      {
        src: '/photos/IMG_2714.jpg',
        caption: 'Nov 2022: Family Thanksgiving dinner together!'
      }
    ],
    meme: {
      title: '',
      quote: '',
      hidden: true,
      searchQuery: '',
      suggestionNote: 'Meme hidden per user request'
    },
    interaction: {
      type: 'shuttle_jump',
      miniGameConfig: {
        title: 'Roller Coaster & Millennium Falcon Run!',
        instruction: 'Press SPACE or Click/Tap to jump the coaster train over the loop-de-loops at Great America & Disneyland!',
        targetEmoji: '🎡',
        playerEmoji: '🎢',
        goalCount: 6,
        victoryMessage: 'Hands in the air! Season Pass maximum value achieved!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 5 2022 photos (2 Tahoe with cousins, Great America, Millennium Falcon at Disney, Family Thanksgiving) loaded!',
      boxFolderHint: 'Box.com -> 2022-02 / 2022-06 / 2022-11',
      notesForPeter: '5 photos from 2022 loaded!'
    }
  },

  // ==========================================
  // SECTOR 5: GRAND EXPEDITIONS & 15 YEARS (2023-2026)
  // ==========================================
  {
    id: '2023-02-tahoe-scotts-valley',
    systemNumber: 28,
    yearMonth: '2023-02',
    stardate: 'February & May 2023',
    sector: 'Sector 5: Grand Expeditions & 15 Years Strong (2023–2026)',
    title: 'Lake Tahoe Winter Cabin & Castle Rock State Park Hike!',
    locationName: 'Lake Tahoe & Castle Rock State Park, CA',
    coords: { lat: 37.2321, lng: -122.0987 },
    planetTheme: 'ice',
    planetEmoji: '🌲',
    captainsLog:
      "Early 2023 kicked off with a wonderful 5-day family winter getaway to Lake Tahoe (Feb 18–22)—playing out in the deep snow together and cozying up on the couch back at the cabin! Once spring arrived, we headed up into the Santa Cruz Mountains on Memorial Day (May 29, 2023) for a scenic family day trip and hike among the sandstone boulders and redwoods of Castle Rock State Park!",
    photos: [
      {
        src: '/photos/tahoe23-IMG_0850.jpg',
        caption: 'Feb 2023: The whole family out in the snow in Lake Tahoe!'
      },
      {
        src: '/photos/tahoe23-IMG_0868.jpg',
        caption: 'Feb 2023: Cozying up together on the couch at our Lake Tahoe cabin!'
      },
      {
        src: '/photos/castelwrockPXL_20230529_191755131.MP.jpg',
        caption: 'May 29, 2023: Memorial Day family hike at Castle Rock State Park!'
      }
    ],
    meme: {
      title: '',
      quote: '',
      hidden: true,
      searchQuery: '',
      suggestionNote: 'Meme hidden per user request'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'tahoe23-IMG_0850.jpg, tahoe23-IMG_0868.jpg, and castelwrockPXL_20230529_191755131.MP.jpg loaded!',
      boxFolderHint: 'Box.com -> 2023-02 / 2023-05',
      notesForPeter: '3 photos from 2023 Tahoe & Castle Rock loaded!'
    }
  },
  {
    id: '2023-07-costa-rica',
    systemNumber: 29,
    yearMonth: '2023-07',
    stardate: 'June 30 – July 15, 2023',
    sector: 'Sector 5: Grand Expeditions & 15 Years Strong (2023–2026)',
    title: 'The 16-Day Jungle Odyssey: VBS Mission Trip & Pura Vida in Costa Rica!',
    locationName: 'Costa Rica (San José, La Fortuna / Arenal & Guanacaste)',
    coords: { lat: 10.4626, lng: -84.7032 },
    planetTheme: 'emerald',
    planetEmoji: '🦥',
    captainsLog:
      "Stardate 2023.5: One of the grandest family expeditions of our entire 15 years! On June 30, 2023, all four of us flew to Costa Rica for a two-week mission trip to run Vacation Bible School (VBS) for the kids of Costa Rica—where Ben spun up cotton candy for the local kids and watched a special baptism in the rain! Along the way, our two monkey-boys explored lush rainforest waterfalls, volcanoes, wildlife, and beaches before flying home on July 15!",
    photos: [
      {
        src: '/photos/268d7831-8d78-417d-9a2e-a46cf8893894.jpg',
        caption: 'July 2023: The whole family on our two-week Costa Rica adventure!'
      },
      {
        src: '/photos/PXL_20230706_173139864.jpg',
        caption: 'July 6, 2023: Ben making cotton candy for the kids at VBS in Costa Rica!'
      },
      {
        src: '/photos/PXL_20230707_170647141.jpg',
        caption: 'July 7, 2023: Wesley at a rainforest waterfall in Costa Rica!'
      },
      {
        src: '/photos/PXL_20230711_174308360.jpg',
        caption: 'July 11, 2023: Wet Ben watching a baptism in Costa Rica!'
      },
      {
        src: '/photos/costa169c3ddab-7db0-4ae1-b876-a991d33d9643.jpg',
        caption: 'July 2023: The monkey-boys in Costa Rica!'
      }
    ],
    meme: {
      title: 'Jurassic Park Main Theme ("Welcome... to Costa Rica!")',
      quote: 'Welcome... to Costa Rica! (Cue the Jurassic Park theme!)',
      audioSrc: '/media/welcome-to-jurassic-park-theme-song.mp3',
      autoPlayAudioOnOpen: true,
      hideYoutubeLink: true,
      searchQuery: 'Jurassic Park theme song',
      suggestionNote: 'Auto-plays welcome-to-jurassic-park-theme-song.mp3 on open with replay button!'
    },
    interaction: {
      type: 'shelf_organizer',
      miniGameConfig: {
        title: 'Costa Rica Canopy Safari: Line Up the Rainforest Sloths!',
        instruction: 'Click each messy sloth in the jungle canopy to line all 4 up neatly for the family photo album!',
        targetEmoji: '🦥',
        playerEmoji: '📸',
        neatLabelPrefix: 'SLOTH',
        bottomBannerText: '🌴 Pura Vida in the Costa Rica Rainforest!',
        goalCount: 4,
        victoryMessage: 'Pura Vida! National Geographic-worthy rainforest album captured!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 5 Costa Rica photos + welcome-to-jurassic-park-theme-song.mp3 loaded!',
      boxFolderHint: 'Box.com -> 2023-07',
      notesForPeter: '5 Costa Rica photos + Jurassic Park MP3 auto-play loaded!'
    }
  },
  {
    id: '2024-04-monterey-universal-yosemite-gwl',
    systemNumber: 30,
    yearMonth: '2024-07',
    stardate: '2024',
    sector: 'Sector 5: Grand Expeditions & 15 Years Strong (2023–2026)',
    title: '2024 Expeditions: Monterey Pirates, Super Nintendo World, Yosemite & Great Wolf Lodge!',
    locationName: 'Monterey, Universal Studios Hollywood, Yosemite & Manteca, CA',
    coords: { lat: 37.738, lng: -119.572 },
    planetTheme: 'emerald',
    planetEmoji: '⛰️',
    captainsLog:
      "2024 was a banner year of California family getaways! We kicked off the New Year in Monterey where the boys posed with pirates (Jan 2), drove down to Universal Studios Hollywood in April where Lucinda and the boys suited up for the Mario Kart ride at Super Nintendo World (Apr 16), explored Yosemite National Park with Grandpa in July (Jul 25–28), and climbed and splashed at Great Wolf Lodge in August (Aug 8–10)!",
    photos: [
      {
        src: '/photos/PXL_20240102_234248778.jpg',
        caption: 'Jan 2, 2024: The boys with pirates in Monterey!'
      },
      {
        src: '/photos/PXL_20240416_175856186.MP.jpg',
        caption: 'April 16, 2024: Lucinda and the boys at Universal Studios ready to go on the Mario ride!'
      },
      {
        src: '/photos/yosemitePXL_20240727_232823074.MP.jpg',
        caption: 'July 27, 2024: The boys and Grandpa in Yosemite National Park!'
      },
      {
        src: '/photos/GWL-PXL_20240809_162358717.MP.jpg',
        caption: 'Aug 9, 2024: Lucinda and the boys climbing at Great Wolf Lodge!'
      }
    ],
    meme: {
      title: '',
      quote: '',
      hidden: true,
      searchQuery: '',
      suggestionNote: 'Meme hidden per user request'
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'All 4 2024 photos (Monterey pirates, Universal Mario ride, Yosemite with Grandpa, Great Wolf Lodge climbing) loaded!',
      boxFolderHint: 'Box.com -> 2024-01 / 2024-04 / 2024-07 / 2024-08',
      notesForPeter: '4 photos from 2024 loaded!'
    }
  },
  {
    id: '2025-04-in-sickness-and-health-parents',
    systemNumber: 31,
    yearMonth: '2025-04',
    stardate: '2025',
    sector: 'Sector 5: Grand Expeditions & 15 Years Strong (2023–2026)',
    title: '"In Sickness and In Health" Part II: Standing By Family (And Peter\'s Broken Arm!)',
    locationName: 'Kaiser Redwood City & Peninsula, CA',
    coords: { lat: 37.4882, lng: -122.2226 },
    planetTheme: 'blue',
    planetEmoji: '💙',
    captainsLog:
      "Marriage isn't just theme parks and beach vacations—it's also holding the bridge together when family needs you most. In 2025, through long days caring for aging parents—and Peter breaking his arm and growing a beard!—Lucinda and Peter once again proved what a 15-year partnership is truly made of.",
    photos: [
      {
        src: '/photos/familypic.jpg',
        caption: 'The whole family together!'
      },
      {
        src: '/photos/PXL_20260101_033041191.MP.jpg',
        caption: 'Also, Peter broke his arm and grew a beard.'
      }
    ],
    meme: {
      title: '',
      quote: '',
      hidden: true,
      searchQuery: '',
      suggestionNote: 'Meme hidden per user request'
    },
    interaction: {
      type: 'tricorder_scan',
      miniGameConfig: {
        title: 'Starfleet Support Beam: Send Love & Strength to the Family',
        instruction: 'Click to boost Family Support Shields across the Peninsula!',
        targetEmoji: '❤️',
        goalCount: 3,
        victoryMessage: 'Full support shields engaged—through sickness and in health, always a team!'
      }
    },
    curation: {
      status: 'ready',
      photoPrompt: 'familypic.jpg and PXL_20260101_033041191.MP.jpg loaded!',
      boxFolderHint: 'Box.com -> 2025-04 / 2025-07',
      notesForPeter: '2 photos loaded!'
    }
  },
  {
    id: '2025-07-trifecta-tahoe-disney-yosemite',
    systemNumber: 32,
    yearMonth: '2025-07',
    stardate: 'Feb, Jul & Dec 2025',
    sector: 'Sector 5: Grand Expeditions & 15 Years Strong (2023–2026)',
    title: 'The 2025 California Classics: Winter & Summer Tahoe & Cousins at Filoli!',
    locationName: 'Lake Tahoe, Yosemite, Disneyland & Filoli Gardens',
    coords: { lat: 38.945, lng: -119.975 },
    planetTheme: 'gold',
    planetEmoji: '🌟',
    captainsLog:
      "In 2025, our crew hit every single family classic across the calendar: hanging out with the cousins and playing dominoes in Lake Tahoe for winter break (February 2025), Disneyland and Yosemite adventures, exploring mountain streams in Lake Tahoe during the summer (July 2025), and gathering with the cousins at Filoli Gardens!",
    photos: [
      {
        src: '/photos/PXL_20250218_214152283.PORTRAIT.jpg',
        caption: 'Feb 18, 2025: The boys and their cousins in Lake Tahoe!'
      },
      {
        src: '/photos/PXL_20250221_031328830.MP.jpg',
        caption: 'Feb 2025: Playing dominoes in Lake Tahoe!'
      },
      {
        src: '/photos/PXL_20250714_234552057.jpg',
        caption: 'July 14, 2025: Ben at the stream in Lake Tahoe!'
      },
      {
        src: '/photos/IMG_2283.jpg',
        caption: '2025: Cousins together at Filoli Gardens!'
      }
    ],
    meme: {
      title: 'Star Trek: TNG — "Cause and Effect" Time Loop',
      quote: 'Data: "Captain, we have visited Tahoe 10 times, Disneyland 7 times, and Yosemite 6 times—only the boys keep getting taller in every photo!"',
      hideAudioLinks: true,
      hideYoutubeLink: true
    },
    interaction: {
      type: 'warp_only'
    },
    curation: {
      status: 'ready',
      photoPrompt: 'PXL_20250218_214152283.PORTRAIT.jpg, PXL_20250221_031328830.MP.jpg, PXL_20250714_234552057.jpg, and IMG_2283.jpg loaded!',
      boxFolderHint: 'Box.com -> 2025-02 / 2025-07 / 2025-12',
      notesForPeter: '4 photos loaded!'
    }
  },
  {
    id: '2026-11-fifteen-year-finale',
    systemNumber: 33,
    yearMonth: '2026-06',
    stardate: 'November 11, 2026 (15th Anniversary!)',
    sector: 'Sector 5: Grand Expeditions & 15 Years Strong (2023–2026)',
    title: '15 Years Boldly Going Together: Happy 15th Anniversary, Captain Lucinda!',
    locationName: 'Starbase Cupertino & Beyond (2011–2026)',
    coords: { lat: 37.3169, lng: -122.0256 },
    planetTheme: 'gold',
    planetEmoji: '🚀💖',
    captainsLog:
      "Captain's Log, Stardate 11.11.2026: Following our 2026 adventures in Disneyland (April 12–16) and Yosemite (June 12–18), the U.S.S. Fifteeners completes its first 15-Year Mission! From two newlyweds at Valley Church on 11-11-11 and a PT Cruiser in the Sunnyvale garage, to raising Wesley and Ben and traveling the world—here's to the next 50+ years in the stars together. I love you, Lucinda!",
    photos: [
      {
        src: '/photos/11-11-11-Weddign kiss.jpg',
        caption: 'Where it all began on 11-11-11 — and still going strong at Warp 15!'
      }
    ],
    meme: {
      title: 'Star Trek: The Next Generation Finale — "All Good Things..."',
      quote: 'Picard: "Five-card stud, nothing wild... and the sky\'s the limit!" Happy 15th Anniversary, my Captain!',
      videoOrGifSrc: '/media/fivecardstud.mp4',
      hideAudioLinks: true,
      hideYoutubeLink: true
    },
    interaction: {
      type: 'choice',
      prompt: 'Starfleet Command Renewal Order: Ready to sign on for the NEXT 15-Year Mission?',
      choices: [
        {
          label: '💖 "Make It So!" — Engage Warp 15 into the Future Together!',
          outcome: '🎉 HAPPY 15TH ANNIVERSARY, CAPTAIN LUCINDA! 🎉'
        },
        {
          label: '🖖 "Live Long and Prosper" — Requesting Second Honeymoon on Risa!',
          outcome: '🎉 HAPPY 15TH ANNIVERSARY, CAPTAIN LUCINDA! 🎉'
        }
      ]
    },
    curation: {
      status: 'ready',
      photoPrompt: '11-11-11-Weddign kiss.jpg and fivecardstud.mp4 loaded!',
      boxFolderHint: 'Box.com -> 2026-04 or 2026-06',
      notesForPeter: 'Grand finale ready with fivecardstud.mp4 and end-credits.mp3!'
    }
  }
];
