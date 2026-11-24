import type { Track } from '../types';

/**
 * ========================================================================
 * FOCUS.MEHEDI-HASAN.ME MASTER SOUNDSCAPE CATALOG
 * ========================================================================
 * Exclusively features your 6 master meditation & deep work audio files.
 * ========================================================================
 */

export const TRACKS: Track[] = [
  // 1. DEEP FOCUS
  {
    id: 'meditation-nisshim-nilimay',
    title: 'নিঃসীম নীলিমায় (In the Boundless Blue)',
    artist: 'Astral Horizon',
    categoryId: 'deep-focus',
    categoryName: 'Deep Focus',
    audioSrc: '/music/meditation-nisshim-nilimay.mp3',
    artwork: '/images/artwork/deep-focus.svg',
    duration: 2883, // 48m 03s
    frequency: 'Alpha-Theta Expansion',
    description: 'অনন্ত আকাশ ও নীলিমার মতো মনকে প্রসারিত করে গভীর কাজে দীর্ঘক্ষণ নিমগ্ন থাকার সহায়ক সুর।',
    tags: ['deep-focus', 'boundless', 'flow', 'clarity', 'study', 'বাংলা'],
  },

  // 2. MEDITATION
  {
    id: 'atmar-alor-chowa',
    title: 'আত্মার আলোর ছোঁয়া (Touch of the Soul\'s Light)',
    artist: 'Solfeggio Masterworks',
    categoryId: 'meditation',
    categoryName: 'Meditation',
    audioSrc: '/music/atmar-alor-chowa.mp3',
    artwork: '/images/artwork/meditation.svg',
    duration: 4074, // 67m 54s
    frequency: '432Hz Spiritual Healing',
    description: 'একটি পরম প্রশান্তিময় আত্মিক সুরমূর্ছনা — গভীর ধ্যান, মননশীলতা ও আন্তরিক শান্তির জন্য রচিত।',
    tags: ['meditation', 'soul', 'peace', 'spiritual', 'healing', 'বাংলা'],
  },
  {
    id: 'meditation-naba-jagaran',
    title: 'মেডিটেশন মিউজিক: নব জাগরণ (New Awakening)',
    artist: 'Bodhi Sound Lab',
    categoryId: 'meditation',
    categoryName: 'Meditation',
    audioSrc: '/music/meditation-naba-jagaran.mp3',
    artwork: '/images/artwork/meditation.svg',
    duration: 4012, // 66m 52s
    frequency: '528Hz Transformation & Awakening',
    description: 'নব চেতনা ও নির্মল আত্মশক্তির উন্মেষ ঘটানোর বিশেষ দীর্ঘ ধ্যান সঙ্গীত।',
    tags: ['awakening', 'meditation', 'transformation', 'mindfulness', 'বাংলা'],
  },

  // 3. RAIN SOUNDS
  {
    id: 'megher-snigdho-shur',
    title: 'মেঘের স্নিগ্ধ সুর (Gentle Cloud Melodies)',
    artist: 'Atmospheric Cloud Lab',
    categoryId: 'rain',
    categoryName: 'Rain Sounds',
    audioSrc: '/music/megher-snigdho-shur.mp3',
    artwork: '/images/artwork/rain.svg',
    duration: 4338, // 72m 18s
    frequency: 'Atmospheric Cloud Harmony',
    description: 'মেঘের ভেজা বাতাসের মতো স্নিগ্ধ কোমল সুর, যা মনকে নিমেষেই শান্ত ও মনোযোগী করে তোলে।',
    tags: ['clouds', 'rain', 'soothing', 'atmosphere', 'calm', 'বাংলা'],
  },

  // 4. NATURE & FOREST
  {
    id: 'meditation-prokritir-protidhwoni',
    title: 'প্রকৃতির প্রতিধ্বনি (Echo of Nature)',
    artist: 'Prakriti Sanctuary',
    categoryId: 'nature',
    categoryName: 'Nature & Forest',
    audioSrc: '/music/meditation-prokritir-protidhwoni.mp3',
    artwork: '/images/artwork/nature.svg',
    duration: 6020, // 100m 20s
    frequency: 'Organic Forest Resonance',
    description: 'প্রকৃতির কোলাহলমুক্ত নিস্তব্ধতা ও বৃক্ষলতার স্নিগ্ধ স্পন্দন নিয়ে ১০০ মিনিটের এক দীর্ঘ ধ্যান ও পাঠের সফর।',
    tags: ['nature', 'forest', 'echo', 'long-focus', 'mindful', 'peace', 'বাংলা'],
  },

  // 5. PIANO & AMBIENT
  {
    id: 'shubhratar-alo',
    title: 'শুভ্রতার আলো (Light of Purity & Serenity)',
    artist: 'Shanti Harmony',
    categoryId: 'piano',
    categoryName: 'Piano & Ambient',
    audioSrc: '/music/shubhratar-alo.mp3',
    artwork: '/images/artwork/piano.svg',
    duration: 5288, // 88m 08s
    frequency: 'Pure Solfeggio Resonance',
    description: 'পরম শান্তি ও শুভ্রতার অনুভূতি জাগিয়ে তোলার স্নিগ্ধ পিয়ানো ও অ্যাম্বিয়েন্ট সুরমূর্ছনা।',
    tags: ['purity', 'light', 'piano', 'serenity', 'rest', 'quiet', 'বাংলা'],
  },
];

export function getTrackById(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function getTracksByCategory(categoryId: string): Track[] {
  return TRACKS.filter((t) => t.categoryId === categoryId);
}
