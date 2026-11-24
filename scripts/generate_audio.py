import os
import math
import random
import struct
import lameenc

SR = 44100

def smoothstep(x):
    return x * x * (3 - 2 * x)

def apply_loop_crossfade(samples, cross_samples=int(SR * 0.4)):
    """Crossfades the end of the audio into the start to ensure 100% clickless looping."""
    n = len(samples)
    out = list(samples)
    for i in range(cross_samples):
        t = i / cross_samples
        fade_out = 1.0 - smoothstep(t)
        fade_in = smoothstep(t)
        # Blend the tail into the beginning
        out[i] = samples[i] * fade_in + samples[n - cross_samples + i] * fade_out
        out[n - cross_samples + i] = out[i]
    return out

def save_mp3(left, right, path, bitrate=128):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    n = len(left)
    packed = []
    
    # Peak normalization to -1.5 dB (~27000 int16)
    max_val = max(max(abs(x) for x in left), max(abs(x) for x in right), 1e-5)
    scale = 27000.0 / max_val
    
    for i in range(n):
        l_val = max(-32767, min(32767, int(left[i] * scale)))
        r_val = max(-32767, min(32767, int(right[i] * scale)))
        packed.append(struct.pack('<hh', l_val, r_val))
        
    raw_bytes = b''.join(packed)
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(bitrate)
    encoder.set_in_sample_rate(SR)
    encoder.set_channels(2)
    encoder.set_quality(2)
    mp3 = encoder.encode(raw_bytes) + encoder.flush()
    with open(path, 'wb') as f:
        f.write(mp3)
    print(f"Generated: {path} ({len(mp3)} bytes)")

# ----------------- SYNTHESIS ENGINES -----------------

def gen_binaural(base_freq, beat_freq, duration=15.0):
    n = int(SR * duration)
    left, right = [], []
    f_l = base_freq
    f_r = base_freq + beat_freq
    
    # Pink noise buffer
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0
    
    for i in range(n):
        t = i / SR
        # Left and Right binaural sine
        sl = math.sin(2 * math.pi * f_l * t) * 0.4
        sr = math.sin(2 * math.pi * f_r * t) * 0.4
        
        # Add harmonic drone
        drone = (math.sin(2 * math.pi * (base_freq * 0.5) * t) * 0.25 +
                 math.sin(2 * math.pi * (base_freq * 1.5) * t) * 0.1)
        
        # Add warm lowpass noise
        white = random.uniform(-1, 1)
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.02
        b6 = white * 0.115926
        
        # Subtle slow breathing modulation (0.1 Hz)
        breath = 0.85 + 0.15 * math.sin(2 * math.pi * 0.1 * t)
        
        left.append((sl + drone + pink) * breath)
        right.append((sr + drone + pink) * breath)
        
    return apply_loop_crossfade(left), apply_loop_crossfade(right)

def gen_singing_bowl(duration=15.0):
    n = int(SR * duration)
    left, right = [0.0]*n, [0.0]*n
    
    # Fundamental and harmonic frequencies of Tibetan singing bowls
    partials = [
        (216.0, 1.0, 0.05),     # Fundamental
        (432.0, 0.5, 0.08),     # 2nd
        (580.0, 0.3, 0.12),     # Inharmonic 1
        (864.0, 0.2, 0.18),     # 4th
        (1160.0, 0.15, 0.25),   # Inharmonic 2
    ]
    
    # Strikes at regular points that loop
    strikes = [0.0, 5.0, 10.0]
    for s_time in strikes:
        s_idx = int(s_time * SR)
        for i in range(s_idx, min(n, s_idx + int(SR * 8.0))):
            dt = (i - s_idx) / SR
            strike_amp = math.exp(-dt * 0.35)
            # Wobble frequency modulation (slow beat)
            wobble = math.sin(2 * math.pi * 2.5 * dt) * 0.08
            for freq, weight, decay_rate in partials:
                decay = math.exp(-dt * decay_rate)
                tone = math.sin(2 * math.pi * (freq + wobble) * dt) * weight * decay
                pan_l = 0.6 + 0.1 * math.sin(2 * math.pi * 0.3 * dt)
                pan_r = 1.0 - pan_l
                left[i] += tone * strike_amp * pan_l
                right[i] += tone * strike_amp * pan_r
                
    # Add gentle ambient temple breath
    for i in range(n):
        t = i / SR
        air = (math.sin(2 * math.pi * 108 * t) * 0.08 +
               math.sin(2 * math.pi * 162 * t) * 0.04)
        left[i] += air
        right[i] += air
        
    return apply_loop_crossfade(left), apply_loop_crossfade(right)

def gen_rain(intensity='gentle', duration=15.0):
    n = int(SR * duration)
    left, right = [0.0]*n, [0.0]*n
    
    # Pink noise base
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0
    for i in range(n):
        white = random.uniform(-1, 1)
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12
        b6 = white * 0.115926
        left[i] += pink
        right[i] += pink
        
    # Thousands of randomized droplet impacts
    drop_count = int(duration * (400 if intensity == 'gentle' else 900))
    for _ in range(drop_count):
        idx = random.randint(0, n - 2000)
        pan = random.uniform(0.1, 0.9)
        amp = random.uniform(0.1, 0.45)
        freq = random.uniform(2200, 4800)
        drop_len = random.randint(300, 1200)
        for j in range(drop_len):
            t = j / SR
            val = math.sin(2 * math.pi * freq * t) * math.exp(-j / 120.0) * amp
            if idx + j < n:
                left[idx + j] += val * pan
                right[idx + j] += val * (1.0 - pan)
                
    # If thunderstorm, add 2 rolling thunder rumbles
    if intensity == 'thunder':
        thunder_times = [3.5, 11.0]
        for tt in thunder_times:
            t_idx = int(tt * SR)
            t_dur = int(SR * 3.5)
            for j in range(t_dur):
                if t_idx + j < n:
                    progress = j / t_dur
                    env = math.sin(progress * math.pi) * 0.7
                    rumble = (math.sin(2 * math.pi * 45 * (j / SR)) +
                              math.sin(2 * math.pi * 65 * (j / SR) + random.uniform(-0.2, 0.2)) * 0.6 +
                              random.uniform(-0.15, 0.15))
                    left[t_idx + j] += rumble * env * 0.4
                    right[t_idx + j] += rumble * env * 0.35
                    
    return apply_loop_crossfade(left), apply_loop_crossfade(right)

def gen_ocean(duration=16.0):
    """Ocean waves with periodic swell and receding foam."""
    n = int(SR * duration)
    left, right = [0.0]*n, [0.0]*n
    
    # 8-second wave period (2 full waves in 16 seconds for perfect looping)
    period = 8.0
    for i in range(n):
        t = i / SR
        phase = (t % period) / period
        
        # Swell envelope: asymmetric build and fade
        swell = math.sin(phase * math.pi) ** 2.2
        foam_tail = math.exp(-((phase - 0.5) ** 2) / 0.08) * 0.6 if phase > 0.4 else 0.0
        
        # Multi-scale filtered noise
        noise = random.uniform(-1, 1)
        sub_wash = math.sin(2 * math.pi * 35 * t + random.uniform(-0.1, 0.1)) * swell * 0.35
        mid_wash = noise * (swell * 0.3 + foam_tail * 0.4)
        
        # Stereo movement: wave rolling from left to right
        pan_left = 0.5 + 0.35 * math.sin(2 * math.pi * (t / period))
        pan_right = 1.0 - pan_left
        
        left[i] = sub_wash * 0.5 + mid_wash * pan_left
        right[i] = sub_wash * 0.5 + mid_wash * pan_right
        
    return apply_loop_crossfade(left), apply_loop_crossfade(right)

def gen_forest(duration=15.0):
    """Whispering wind through trees with gentle bird chirps."""
    n = int(SR * duration)
    left, right = [0.0]*n, [0.0]*n
    
    # Soft wind base with sweeping resonance
    for i in range(n):
        t = i / SR
        wind_mod = 0.5 + 0.5 * math.sin(2 * math.pi * 0.15 * t)
        noise = random.uniform(-1, 1) * 0.15 * wind_mod
        left[i] += noise
        right[i] += noise * 0.95
        
    # Gentle birdsong chirps at musical intervals
    chirp_times = [1.2, 4.0, 7.5, 10.8, 13.2]
    for ct in chirp_times:
        idx = int(ct * SR)
        chirp_len = int(SR * 0.45)
        base_f = random.choice([2800, 3200, 3600, 4100])
        pan = random.uniform(0.2, 0.8)
        for j in range(chirp_len):
            if idx + j < n:
                t = j / SR
                freq_sweep = base_f + 800 * math.sin(2 * math.pi * 6 * t)
                env = math.sin((j / chirp_len) * math.pi) ** 1.5
                sound = math.sin(2 * math.pi * freq_sweep * t) * env * 0.25
                left[idx + j] += sound * pan
                right[idx + j] += sound * (1.0 - pan)
                
    return apply_loop_crossfade(left), apply_loop_crossfade(right)

def gen_mountain_stream(duration=15.0):
    """Crisp bubbling water trickling over smooth rocks."""
    n = int(SR * duration)
    left, right = [0.0]*n, [0.0]*n
    
    # Hundreds of small bubbling resonant water droplets
    for _ in range(int(duration * 250)):
        idx = random.randint(0, n - 1500)
        pan = random.uniform(0.15, 0.85)
        amp = random.uniform(0.08, 0.3)
        bubble_f = random.uniform(400, 1800)
        b_len = random.randint(200, 900)
        for j in range(b_len):
            if idx + j < n:
                t = j / SR
                freq = bubble_f + (j * 1.5)  # Rising pitch characteristic of bubbles
                val = math.sin(2 * math.pi * freq * t) * math.exp(-j / 80.0) * amp
                left[idx + j] += val * pan
                right[idx + j] += val * (1.0 - pan)
                
    # Add gentle stream bed white noise
    for i in range(n):
        wn = random.uniform(-0.06, 0.06)
        left[i] += wn
        right[i] += wn
        
    return apply_loop_crossfade(left), apply_loop_crossfade(right)

def gen_piano_ambient(chords, duration=16.0):
    """Warm ambient electric/acoustic piano with decaying harmonics and reverb tail."""
    n = int(SR * duration)
    left, right = [0.0]*n, [0.0]*n
    
    chord_len = duration / len(chords)
    for c_idx, chord_freqs in enumerate(chords):
        c_time = c_idx * chord_len
        idx = int(c_time * SR)
        play_len = int(chord_len * 1.5 * SR) # overlap into next chord for reverb sustain
        
        for freq in chord_freqs:
            for j in range(play_len):
                if idx + j < n:
                    dt = j / SR
                    # Harmonic decay (piano string model)
                    decay = math.exp(-dt * 0.8)
                    fundamental = math.sin(2 * math.pi * freq * dt) * 0.4
                    h2 = math.sin(2 * math.pi * freq * 2 * dt) * 0.15 * math.exp(-dt * 1.4)
                    h3 = math.sin(2 * math.pi * freq * 3 * dt) * 0.08 * math.exp(-dt * 2.0)
                    
                    tone = (fundamental + h2 + h3) * decay
                    left[idx + j] += tone * 0.55
                    right[idx + j] += tone * 0.45
                    
    # Ambient warm pad underneath
    for i in range(n):
        t = i / SR
        sub = math.sin(2 * math.pi * 65.4 * t) * 0.1  # C2 warm root
        left[i] += sub
        right[i] += sub
        
    return apply_loop_crossfade(left), apply_loop_crossfade(right)

def gen_fireplace(duration=15.0):
    """Crackling fireplace with wood pops and deep combustion rumble."""
    n = int(SR * duration)
    left, right = [0.0]*n, [0.0]*n
    
    # Low flame rumble
    for i in range(n):
        t = i / SR
        flame = (math.sin(2 * math.pi * 40 * t + random.uniform(-0.1, 0.1)) * 0.15 +
                 random.uniform(-0.04, 0.04))
        left[i] += flame
        right[i] += flame
        
    # Crisp wood snaps and pops
    pop_count = int(duration * 25)
    for _ in range(pop_count):
        idx = random.randint(0, n - 2000)
        pan = random.uniform(0.2, 0.8)
        amp = random.uniform(0.3, 0.8)
        snap_len = random.randint(60, 400)
        snap_freq = random.uniform(1200, 3500)
        for j in range(snap_len):
            if idx + j < n:
                t = j / SR
                snap = math.sin(2 * math.pi * snap_freq * t) * math.exp(-j / 30.0) * amp
                left[idx + j] += snap * pan
                right[idx + j] += snap * (1.0 - pan)
                
    # Constant ember sizzle
    for _ in range(int(duration * 120)):
        idx = random.randint(0, n - 500)
        pan = random.uniform(0.1, 0.9)
        amp = random.uniform(0.05, 0.18)
        for j in range(random.randint(40, 180)):
            if idx + j < n:
                sizzle = random.uniform(-1, 1) * amp * (1.0 - j / 180.0)
                left[idx + j] += sizzle * pan
                right[idx + j] += sizzle * (1.0 - pan)
                
    return apply_loop_crossfade(left), apply_loop_crossfade(right)

def main():
    print("Beginning audio generation for all 7 categories...")
    
    # 1. Deep Focus
    l, r = gen_binaural(140.0, 10.0, duration=16.0) # 10Hz Alpha
    save_mp3(l, r, "public/music/focus-alpha-flow.mp3")
    
    l, r = gen_binaural(220.0, 40.0, duration=16.0) # 40Hz Gamma
    save_mp3(l, r, "public/music/focus-gamma-deep.mp3")
    
    l, r = gen_binaural(108.0, 14.0, duration=16.0) # 14Hz Sensorimotor Rhythm
    save_mp3(l, r, "public/music/focus-zenith-coding.mp3")
    
    # 2. Meditation
    l, r = gen_singing_bowl(duration=15.0)
    save_mp3(l, r, "public/music/meditation-tibetan-bowl.mp3")
    
    l, r = gen_singing_bowl(duration=15.0) # Zen chimes variation
    save_mp3(l, r, "public/music/meditation-zen-temple.mp3")
    
    l, r = gen_binaural(136.1, 7.83, duration=16.0) # Schumann 7.83Hz + Om 136.1Hz
    save_mp3(l, r, "public/music/meditation-om-drone.mp3")
    
    # 3. Rain Sounds
    l, r = gen_rain('gentle', duration=15.0)
    save_mp3(l, r, "public/music/rain-gentle-window.mp3")
    
    l, r = gen_rain('thunder', duration=15.0)
    save_mp3(l, r, "public/music/rain-thunderstorm.mp3")
    
    l, r = gen_rain('forest', duration=15.0)
    save_mp3(l, r, "public/music/rain-forest-canopy.mp3")
    
    # 4. Nature & Forest
    l, r = gen_forest(duration=15.0)
    save_mp3(l, r, "public/music/nature-whispering-pines.mp3")
    
    l, r = gen_forest(duration=15.0)
    save_mp3(l, r, "public/music/nature-birds-morning.mp3")
    
    l, r = gen_mountain_stream(duration=15.0)
    save_mp3(l, r, "public/music/nature-mountain-stream.mp3")
    
    # 5. Ocean Waves
    l, r = gen_ocean(duration=16.0)
    save_mp3(l, r, "public/music/ocean-gentle-tides.mp3")
    
    l, r = gen_ocean(duration=16.0)
    save_mp3(l, r, "public/music/ocean-deep-abyss.mp3")
    
    l, r = gen_ocean(duration=16.0)
    save_mp3(l, r, "public/music/ocean-coastal-breeze.mp3")
    
    # 6. Piano & Ambient
    # Db maj7 -> Bbm9 -> Gb maj7 -> Ab sus
    chords_1 = [
        [138.59, 207.65, 261.63, 311.13, 415.30], # Db maj7
        [116.54, 174.61, 233.08, 277.18, 349.23], # Bbm9
        [92.50, 146.83, 185.00, 233.08, 293.66],  # Gb maj7
        [103.83, 155.56, 207.65, 261.63, 311.13], # Ab sus
    ]
    l, r = gen_piano_ambient(chords_1, duration=16.0)
    save_mp3(l, r, "public/music/piano-moonlit-waltz.mp3")
    
    # Fm9 -> Eb maj7 -> Db add9 -> C7b9
    chords_2 = [
        [174.61, 261.63, 311.13, 392.00, 466.16],
        [155.56, 233.08, 293.66, 349.23, 440.00],
        [138.59, 207.65, 277.18, 311.13, 415.30],
        [130.81, 196.00, 246.94, 293.66, 370.00],
    ]
    l, r = gen_piano_ambient(chords_2, duration=16.0)
    save_mp3(l, r, "public/music/piano-quiet-solitude.mp3")
    
    # C maj9 -> Am9 -> F maj9 -> G add9
    chords_3 = [
        [130.81, 196.00, 246.94, 293.66, 392.00],
        [110.00, 164.81, 220.00, 261.63, 329.63],
        [87.31, 130.81, 174.61, 220.00, 261.63],
        [98.00, 146.83, 196.00, 246.94, 293.66],
    ]
    l, r = gen_piano_ambient(chords_3, duration=16.0)
    save_mp3(l, r, "public/music/piano-ethereal-dawn.mp3")
    
    # 7. Sleep & Relaxation
    l, r = gen_binaural(90.0, 2.5, duration=16.0) # 2.5Hz Delta
    save_mp3(l, r, "public/music/sleep-delta-waves.mp3")
    
    l, r = gen_binaural(110.0, 3.0, duration=16.0) # Night sky cosmic drone
    save_mp3(l, r, "public/music/sleep-night-sky.mp3")
    
    l, r = gen_fireplace(duration=15.0)
    save_mp3(l, r, "public/music/sleep-warm-fireplace.mp3")
    
    print("All 21 audio files successfully generated!")

if __name__ == '__main__':
    main()
