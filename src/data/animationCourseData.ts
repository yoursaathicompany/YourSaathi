// ============================================================
// Course Data — The Professional Animation & CGI Pipeline
// 4 progressive modules: 2D → 3D → VFX → Real-Time Rendering
// ============================================================

import { CodeBlock, CourseModule } from './courseData';

export const animationCourseMetadata = {
  title: 'The Professional Animation & CGI Pipeline',
  description:
    'A studio-grade 4-module course covering the complete animation pipeline — from traditional 2D principles to photorealistic real-time rendering in Unreal Engine 5. Learn the exact workflows used at Pixar, ILM, and Weta Digital.',
  estimatedHours: '50–70 hours',
  prerequisites: [
    'A computer capable of running Blender 3.6+ (free) or Maya',
    'Basic understanding of art fundamentals (we review key concepts)',
    'Willingness to practice — animation is a craft',
    'No prior 3D experience required — we build from the ground up',
  ],
  softwareStack: `Blender 3.6+ (Free & Open Source)
Toon Boom Harmony (2D Animation)
Autodesk Maya (Industry Standard 3D)
SideFX Houdini (VFX & Simulations)
Unreal Engine 5 (Real-Time Rendering)
Adobe After Effects (Compositing)
DaVinci Resolve (Color Grading — Free)
Substance 3D Painter (PBR Texturing)`,
};

// ── MODULE 1 ─────────────────────────────────────────────
const animModule1: CourseModule = {
  slug: '2d-animation-fundamentals',
  number: 1,
  title: 'Advanced 2D Animation',
  subtitle: 'Traditional Principles Meet Digital Pipeline',
  emoji: '🎬',
  color: 'from-rose-500 to-red-400',
  objective: [
    'Master the 12 Principles of Animation — the foundation used at every major studio.',
    'Understand frame timing, spacing, and the difference between animating on 1s, 2s, and 3s.',
    'Learn digital vector animation and puppet rigging in Toon Boom Harmony.',
    'Build a professional walk cycle and character acting shot from scratch.',
    'Understand the studio pipeline: from storyboard to final composite.',
  ],
  estimatedHours: '12–16 hours',
  difficulty: 'Beginner',
  prerequisites: ['A drawing tablet (Wacom/iPad) OR mouse', 'Basic computer skills', 'No animation experience required — we start from frame one!'],
  tags: ['12 Principles', 'Walk Cycle', 'Timing & Spacing', 'Toon Boom', 'After Effects', 'Puppet Rigging', 'Storyboards'],
  theorySections: [
    {
      heading: '🎬 What is Animation? (The Industry Perspective)',
      content:
        'Animation is NOT just "making things move." At a professional level, animation is the art of creating the ILLUSION of life. Every frame is a deliberate decision — there are no accidents in great animation.\n\nThe pipeline at a major studio like Pixar or Disney follows strict phases:\n\n1. Story & Script → What are we telling?\n2. Storyboarding → Visual blueprint of every shot\n3. Pre-visualization (Pre-viz) → Rough 3D/2D timing pass\n4. Layout → Camera placement and staging\n5. Blocking → Key poses only (the "storytelling" pass)\n6. Splining → Smooth interpolation between keys\n7. Polish → Micro-details, overlapping action, secondary motion\n8. Rendering & Compositing → Final output\n\nWhether you work in 2D or 3D, this pipeline is universal. Master it once, and you can work anywhere.',
    },
    {
      heading: '📐 The 12 Principles of Animation',
      content:
        'Created by Disney legends Frank Thomas and Ollie Johnston in the 1930s, these principles are STILL the foundation of every animation you see today — from Pixar films to video games.\n\nThink of these as the "grammar" of animation. You can break the rules creatively, but only AFTER you understand them.',
      table: {
        headers: ['#', 'Principle', 'What It Does', 'Example'],
        rows: [
          ['1', 'Squash & Stretch', 'Gives a sense of weight and flexibility', 'A bouncing ball squashes on impact, stretches in the air'],
          ['2', 'Anticipation', 'Prepares the audience for a major action', 'A character crouches before jumping'],
          ['3', 'Staging', 'Presents an idea so it is clear', 'Silhouette test — can you read the pose in shadow?'],
          ['4', 'Straight Ahead vs Pose-to-Pose', 'Two animation methods', 'Straight Ahead = wild/organic, Pose-to-Pose = controlled'],
          ['5', 'Follow Through & Overlapping Action', 'Parts of the body move at different rates', 'Hair keeps moving after the head stops'],
          ['6', 'Slow In / Slow Out (Ease)', 'Motion accelerates and decelerates', 'A car eases into motion, doesn\'t teleport'],
          ['7', 'Arcs', 'Natural motion follows curved paths', 'An arm swings in an arc, not a straight line'],
          ['8', 'Secondary Action', 'Supporting actions reinforce the main one', 'Walking (primary) + swinging arms (secondary)'],
          ['9', 'Timing', 'The number of frames per action = mood/weight', 'Fast = light/snappy, Slow = heavy/dramatic'],
          ['10', 'Exaggeration', 'Push beyond reality for impact', 'A surprised character\'s eyes go 3× their size'],
          ['11', 'Solid Drawing / Solid Posing', 'Forms have weight, depth, and balance', 'Avoid "twinning" — never make both arms identical'],
          ['12', 'Appeal', 'Characters must be interesting to watch', 'Clear design, strong silhouette, readable expressions'],
        ],
      },
    },
    {
      heading: '⏱️ Timing & Spacing — The Secret Weapon',
      content:
        'Timing and Spacing are what separate amateur animation from professional work. They are arguably MORE important than drawing skill.\n\n• Timing = HOW MANY frames an action takes (e.g., a punch in 4 frames vs 12 frames)\n• Spacing = WHERE the object is on each frame (even spacing = mechanical, uneven = organic)\n\nFrame Rate Standards:\n• Film: 24 fps (frames per second)\n• TV Animation: 24 fps, often animated on 2s (12 unique drawings per second)\n• Games: 30 or 60 fps\n• Web: 24 fps\n\nAnimating "on 1s" means a new drawing every frame (24 drawings/sec) — smooth but expensive.\nAnimating "on 2s" means a new drawing every OTHER frame (12 drawings/sec) — the standard for TV.',
      table: {
        headers: ['Timing Style', 'Frames', 'Feel', 'Used In'],
        rows: [
          ['On 1s', '24 drawings/sec', 'Silky smooth, cinematic', 'Disney features, fast action'],
          ['On 2s', '12 drawings/sec', 'Snappy, energetic', 'Anime, TV animation, most 2D'],
          ['On 3s', '8 drawings/sec', 'Choppy, stylized', 'Spider-Verse, limited animation'],
          ['Mixed', 'Varies per shot', 'Dynamic, deliberate', 'Best studios mix freely'],
        ],
      },
    },
    {
      heading: '🖥️ Digital 2D Pipeline — Vector vs Raster',
      content:
        'Modern 2D animation uses two primary approaches:\n\n1. Frame-by-Frame (Raster): Draw every frame individually. Maximum artistic freedom but extremely labor-intensive. Used for: hand-drawn features, key emotional moments.\n\n2. Puppet/Rigging (Vector): Build a character out of reusable parts (head, arms, legs, eyes) connected by joints. Animate by moving the joints. Used for: TV series, web content, games.\n\nBoth are valid professional techniques. Most studios use a HYBRID — puppet rigs for dialogue scenes and frame-by-frame for action.\n\nIndustry Tools:\n• Toon Boom Harmony — The industry standard for 2D (used by Disney TV, Cartoon Network)\n• Adobe Animate — Web animation, simple projects\n• TVPaint — Frame-by-frame specialist (used by Studio Ghibli)\n• OpenToonz — Free, used by Studio Ghibli',
    },
    {
      heading: '🏃 The Walk Cycle — Animator\'s Rite of Passage',
      content:
        'The walk cycle is the single most important exercise in animation. Why? Because it tests EVERY principle simultaneously:\n\n• Timing (step duration)\n• Weight (how heavy is the character?)\n• Personality (confident? tired? sneaky?)\n• Follow-through (arms, hair, clothing)\n• Arcs (hips, shoulders, head)\n• Balance (center of gravity over the contact foot)\n\nA standard walk cycle has 4 key poses:\n1. Contact — Front foot strikes the ground\n2. Down — Body at its lowest point (weight transfer)\n3. Passing — Back leg passes under the body\n4. Up — Body at its highest point (push-off)\n\nIn a typical walk at 24fps animated on 2s, one full step = 12 frames, one complete cycle (left+right) = 24 frames = 1 second.',
    },
  ],
  codeBlocks: [
    {
      id: 'anim1-after-effects',
      title: 'Step 1: Setting Up a 2D Animation Project',
      language: 'javascript',
      code: `// ── After Effects Expression: Smooth Loop ─────────────
// Apply this expression to any animated property
// to create a perfectly seamless loop.

// Ping-Pong Loop (goes forward then backward)
loopOut("pingpong");

// Cycle Loop (repeats from start)
loopOut("cycle");

// ── Bounce Expression (Physics-based) ─────────────────
// Apply to Position Y for a realistic bouncing ball
// Uses real physics: gravity + energy loss per bounce
var gravity = 2000;        // pixels per second²
var bounceHeight = 400;    // initial drop height
var dampening = 0.7;       // energy retained (0-1)
var bounceFreq = 2.5;      // bounces per second

var t = time - inPoint;
var amplitude = bounceHeight;
var decay = Math.pow(dampening, t * bounceFreq);

// Simulate bounce with sine wave + decay
value + [0, -amplitude * Math.abs(Math.sin(bounceFreq * t * Math.PI)) * decay];

// ── Walk Cycle Timing Template ────────────────────────
// Standard walk at 24fps, animated on 2s:
//
// Frame 01: Contact Pose (Right foot forward)
// Frame 03: Down Pose (Weight drops)
// Frame 07: Passing Pose (Left leg swings through)
// Frame 09: Up Pose (Push off, highest point)
// Frame 13: Contact Pose (Left foot forward)  ← MIRROR
// Frame 15: Down Pose
// Frame 19: Passing Pose
// Frame 21: Up Pose
// Frame 25: = Frame 01 (cycle complete)
//
// Total: 24 frames = 1 second per full cycle`,
      troubleshooting: [
        { error: 'Expression error: undefined value', cause: 'Expression applied to wrong property type', fix: 'Ensure the expression is on Position, not Opacity or Rotation' },
        { error: 'Walk cycle doesn\'t loop cleanly', cause: 'First and last frames don\'t match', fix: 'Ensure Frame 25 is identical to Frame 1, then set loop to (1, 24)' },
      ],
    },
    {
      id: 'anim1-toonboom',
      title: 'Step 2: Puppet Rigging in Toon Boom Harmony',
      language: 'python',
      code: `# ── Toon Boom Harmony — Puppet Rig Setup Guide ───────
# While Harmony uses a visual rigging interface,
# you can automate rig setup with its scripting API.

# Harmony Script: Auto-Peg Setup for Character Rig
# This creates the standard hierarchy for a puppet rig.

def create_character_rig(character_name):
    """
    Creates a professional puppet rig hierarchy.
    
    Standard Hierarchy:
    └── Master_Peg (move entire character)
        ├── Body_Peg
        │   ├── Torso
        │   │   ├── Head_Peg
        │   │   │   ├── Head
        │   │   │   ├── Eyes_Peg
        │   │   │   │   ├── Eye_L
        │   │   │   │   └── Eye_R
        │   │   │   ├── Mouth_Peg
        │   │   │   │   └── Mouth (swap library)
        │   │   │   └── Hair_Peg
        │   │   │       └── Hair (with deformers)
        │   │   ├── Arm_L_Peg
        │   │   │   ├── Upper_Arm_L
        │   │   │   ├── Forearm_L
        │   │   │   └── Hand_L (swap library)
        │   │   └── Arm_R_Peg
        │   │       └── (mirror of Arm_L)
        │   ├── Hips_Peg
        │   │   ├── Leg_L_Peg
        │   │   │   ├── Thigh_L
        │   │   │   ├── Shin_L
        │   │   │   └── Foot_L
        │   │   └── Leg_R_Peg
        │   │       └── (mirror of Leg_L)
        │   └── Shadow
        └── Effects_Peg
            ├── Motion_Blur
            └── Particles
    """
    
    # Create pegs for each body part
    pegs = {
        "Master":   f"{character_name}_Master_Peg",
        "Body":     f"{character_name}_Body_Peg",
        "Head":     f"{character_name}_Head_Peg",
        "Arm_L":    f"{character_name}_Arm_L_Peg",
        "Arm_R":    f"{character_name}_Arm_R_Peg",
        "Leg_L":    f"{character_name}_Leg_L_Peg",
        "Leg_R":    f"{character_name}_Leg_R_Peg",
    }
    
    print(f"✅ Rig hierarchy created for: {character_name}")
    print(f"   Total pegs: {len(pegs)}")
    print(f"   Deformer zones: Hips, Shoulders, Wrists")
    print(f"   Swap libraries: Mouth (visemes), Hands (poses)")
    
    return pegs

# ── Deformer Setup Notes ──────────────────────────────
# Bone Deformers: Use for limbs (smooth bend at elbows/knees)
# Curve Deformers: Use for hair, tails, tentacles (fluid motion)
# Envelope Deformers: Use for facial expressions (lattice warp)
#
# PRO TIP: Always place deformers ABOVE the artwork in
# the node view, never below. Deformers flow top-down.`,
      troubleshooting: [
        { error: 'Drawing appears behind other layers', cause: 'Z-depth ordering incorrect', fix: 'Use the Top/Side view to adjust Z-depth, or reorder in the Timeline panel' },
        { error: 'Deformer causes artwork to "tear"', cause: 'Deformer influence radius too small', fix: 'Increase the deformer envelope size in the Rigging tool options' },
      ],
    },
    {
      id: 'anim1-animation-curves',
      title: 'Step 3: Understanding Animation Curves (F-Curves)',
      language: 'python',
      code: `# ── Animation Curves: The Animator's Control Panel ────
# F-Curves (Function Curves) are the GRAPH representation
# of your animation over time. Mastering them is essential.

import numpy as np
import matplotlib.pyplot as plt

def visualise_easing_curves():
    """
    Visualise the 4 fundamental easing types.
    Every motion in animation uses one of these.
    """
    t = np.linspace(0, 1, 100)  # Normalised time (0 to 1)
    
    # 1. Linear — Constant speed (robotic, unnatural)
    linear = t
    
    # 2. Ease In — Starts slow, ends fast (acceleration)
    #    Think: a ball dropped from height (gravity)
    ease_in = t ** 2.5
    
    # 3. Ease Out — Starts fast, ends slow (deceleration)
    #    Think: a ball thrown upward (slowing down)
    ease_out = 1 - (1 - t) ** 2.5
    
    # 4. Ease In-Out — Slow start, fast middle, slow end
    #    Think: a car starting and stopping at a light
    ease_in_out = np.where(
        t < 0.5,
        2 * t ** 2,           # First half: ease in
        1 - (-2 * t + 2) ** 2 / 2  # Second half: ease out
    )
    
    # ── Plot ───────────────────────────────────────────
    fig, axes = plt.subplots(1, 4, figsize=(20, 4))
    curves = [
        (linear, "Linear\\n(Robotic)", "#ff4444"),
        (ease_in, "Ease In\\n(Accelerate)", "#44aaff"),
        (ease_out, "Ease Out\\n(Decelerate)", "#44ff88"),
        (ease_in_out, "Ease In-Out\\n(Natural)", "#ffaa44"),
    ]
    
    for ax, (curve, title, color) in zip(axes, curves):
        ax.plot(t, curve, color=color, linewidth=3)
        ax.set_title(title, fontsize=12, fontweight="bold")
        ax.set_xlabel("Time →")
        ax.set_ylabel("Value →")
        ax.grid(True, alpha=0.2)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
    
    plt.suptitle(
        "The 4 Fundamental Easing Curves",
        fontsize=14, fontweight="bold", y=1.05,
    )
    plt.tight_layout()
    plt.savefig("easing_curves.png", dpi=150)
    plt.show()

visualise_easing_curves()
print("\\n💡 PRO TIP: 90% of all animation uses Ease In-Out.")
print("   The curve editor is where good animation becomes GREAT.")
print("   Spend time here — it's worth it.")`,
      troubleshooting: [
        { error: 'Animation looks "floaty" or "swimmy"', cause: 'Bezier handles are too long, creating overshoots', fix: 'Shorten the tangent handles or switch to "Weighted Tangents" mode' },
        { error: 'Motion feels robotic/linear', cause: 'Default interpolation is linear (no easing)', fix: 'Select all keyframes → Right-click → Set to "Auto Bezier" or "Ease In/Out"' },
      ],
    },
  ],
  project: {
    title: 'Professional Walk Cycle & Acting Shot',
    description:
      'Create a complete character walk cycle (24-frame loop) plus a 3-second acting/emotion shot. This is the exact portfolio piece studios look for when hiring junior animators. You\'ll practice timing, spacing, arcs, overlapping action, and personality — all in one assignment.',
    code: {
      id: 'anim1-project',
      title: 'Walk Cycle Production Checklist',
      language: 'markdown',
      code: `# ── DELIVERABLES ──────────────────────────────────────
# 1. Walk Cycle (24 frames, seamless loop)
# 2. Acting Shot (72 frames / 3 seconds)
# 3. Timing Charts for both

# ── WALK CYCLE SPECIFICATION ─────────────────────────
# Format:     1920×1080 (HD)
# Frame Rate: 24 fps
# Duration:   24 frames (1 second loop)
# Style:      On 2s (12 unique drawings)
# View:       Side profile (for clarity)

# Key Poses (MUST include):
# ┌─────────────────────────────────────────────────┐
# │ Frame 01 → Contact     (front foot strikes)     │
# │ Frame 03 → Down        (weight drops, lowest)   │
# │ Frame 07 → Passing     (swing leg passes body)  │
# │ Frame 09 → Up          (push-off, highest)      │
# │ Frame 13 → Contact     (MIRROR of frame 01)     │
# │ Frame 15 → Down        (MIRROR of frame 03)     │
# │ Frame 19 → Passing     (MIRROR of frame 07)     │
# │ Frame 21 → Up          (MIRROR of frame 09)     │
# └─────────────────────────────────────────────────┘

# ── CHECKLIST ─────────────────────────────────────────
# □ Head bobs up and down (Down pose = lowest, Up = highest)
# □ Arms swing OPPOSITE to legs (counter-balance)
# □ Hips shift side-to-side on passing position
# □ Shoulders tilt opposite to hips (contrapposto)
# □ Feet follow arcs, never slide on ground contact
# □ Hair/clothing follows through 2-3 frames late
# □ Loop is seamless — Frame 25 = Frame 01
# □ Silhouette reads clearly at every key pose

# ── ACTING SHOT SPECIFICATION ────────────────────────
# Duration:  72 frames (3 seconds)
# Emotion:   Choose one: Joy → Surprise → Sadness
# Must show: Clear emotional transition
#            At least 2 distinct poses
#            Facial expression change
#            Secondary action (fidgeting, looking away)

# ── GRADING RUBRIC ────────────────────────────────────
# Weight & Balance        25%  (Does the character feel heavy?)
# Timing & Spacing        25%  (Are the curves clean?)
# Personality / Appeal    20%  (Is it interesting to watch?)
# Overlap & Follow-Thru   15%  (Do parts move independently?)
# Technical Polish        15%  (Clean arcs, no pops, smooth loop)`,
      troubleshooting: [
        { error: 'Walk cycle "pops" at the loop point', cause: 'First and last frame positions don\'t match exactly', fix: 'Copy frame 1 to frame 25 in the dope sheet, then trim to 24 frames' },
        { error: 'Character looks like they\'re "ice skating"', cause: 'Feet are sliding on the ground plane', fix: 'Lock the contact foot position — it MUST stay planted until lift-off' },
      ],
    },
  },
};

// ── MODULE 2 ─────────────────────────────────────────────
const animModule2: CourseModule = {
  slug: '3d-rigging-lighting',
  number: 2,
  title: '3D Character Rigging & Cinematic Lighting',
  subtitle: 'Topology, Rigging & Visual Storytelling',
  emoji: '🦴',
  color: 'from-violet-500 to-purple-400',
  objective: [
    'Understand 3D mesh topology — why "good topology" is the difference between smooth deformation and broken joints.',
    'Master IK/FK rigging systems — build a fully animatable character skeleton from scratch.',
    'Learn weight painting techniques for seamless mesh deformations.',
    'Create cinematic lighting setups using three-point lighting, HDRI, and physically-based rendering.',
    'Build a production-ready character rig with a professional lighting setup in Blender/Maya.',
  ],
  estimatedHours: '14–20 hours',
  difficulty: 'Intermediate',
  prerequisites: ['Module 1 completed', 'Basic Blender/Maya navigation (viewport, transform tools)', 'Understanding of animation principles from Module 1'],
  tags: ['Topology', 'Rigging', 'IK/FK', 'Weight Painting', 'Three-Point Lighting', 'HDRI', 'PBR', 'Blender', 'Maya'],
  theorySections: [
    {
      heading: '⚠️ Topology — The Most Critical Skill in 3D (Read This First!)',
      content:
        'Here\'s the truth that separates professionals from hobbyists: TOPOLOGY IS EVERYTHING.\n\nTopology refers to the flow of edges (edge loops) on your 3D mesh. It determines:\n\n• How your character deforms during animation (smooth bends or ugly pinching)\n• How well your model subdivides (clean or lumpy)\n• How efficiently your model renders (polygon budget)\n• Whether your model can be re-used across projects\n\nBad topology = a character whose elbow crumples like paper when bent.\nGood topology = a character whose elbow bends like a real arm, naturally and smoothly.\n\nThe secret: edge loops MUST follow the natural muscle flow of the body. Think of edges as contour lines on a topographic map of the human body.',
    },
    {
      heading: '🔄 Edge Loop Rules — The Non-Negotiables',
      content:
        'Every professional modeler follows these topology rules religiously:',
      table: {
        headers: ['Rule', 'Why It Matters', 'Common Mistake'],
        rows: [
          ['Use ALL quads (4-sided faces)', 'Quads subdivide cleanly; tris/ngons cause pinching', 'Using Booleans without cleanup → ngon nightmare'],
          ['Edge loops around eyes, mouth, nostrils', 'These areas deform the most during facial animation', 'Not enough loops → character can\'t smile/blink'],
          ['Edge loops at every joint', 'Elbows, knees, wrists, shoulders need minimum 3 loops', 'Single edge at elbow → mesh collapses when bent'],
          ['Avoid triangles on deforming areas', 'Tris create unpredictable deformation artifacts', 'Tris on face or joints = ugly stretching'],
          ['Poles (5+ edge vertex) away from joints', 'Poles don\'t deform well', 'Pole on kneecap = pinch on every bend'],
          ['Consistent quad density', 'Uneven density = uneven smoothing', 'Dense face + sparse body looks mismatched'],
        ],
      },
    },
    {
      heading: '🦴 Rigging — Building the Skeleton',
      content:
        'A rig is the "puppet strings" inside a 3D character. It\'s what allows animators to move the model naturally. Without a rig, a beautiful 3D model is just a statue.\n\nThe skeleton hierarchy:\n\nRoot (Hips) → Spine → Chest → Neck → Head\n             → L/R Shoulder → Upper Arm → Forearm → Hand → Fingers\n             → L/R Thigh → Shin → Foot → Toes\n\nTwo control systems:\n\n• FK (Forward Kinematics): Rotate each joint individually, from parent to child.\n  Example: Rotate shoulder → upper arm follows → forearm follows.\n  Best for: Arms during natural motion, overlapping action.\n\n• IK (Inverse Kinematics): Pin the end-effector (hand/foot) and the chain solves automatically.\n  Example: Pin the foot to the ground → knee and hip adjust automatically.\n  Best for: Feet during walking (stay planted), hands grabbing objects.\n\nProfessional rigs allow the animator to SWITCH between IK and FK seamlessly.',
    },
    {
      heading: '🎨 Weight Painting — The Tedious But Critical Step',
      content:
        'Weight painting defines HOW MUCH each bone influences each vertex of the mesh. It\'s painted as a heat map:\n\n• Red (1.0) = full influence — this vertex moves 100% with this bone\n• Yellow (0.5) = partial influence — 50% movement\n• Blue (0.0) = no influence — vertex ignores this bone\n\nGood weight painting creates smooth, anatomical deformations. Bad weight painting makes the character\'s skin "tear" or "collapse" at joints.\n\nKey rules:\n1. Every vertex MUST have weights that sum to 1.0 (normalisation)\n2. Gradually blend weights between adjacent bones (no hard edges)\n3. The elbow crease gets 50/50 split between upper arm & forearm\n4. Test your weights by rotating every joint to extreme angles',
    },
    {
      heading: '💡 Cinematic Lighting — Painting with Light',
      content:
        'In film and animation, lighting is storytelling. The way you light a character tells the audience how to FEEL before a single word is spoken.\n\nThe foundation: Three-Point Lighting\n\n1. Key Light — The primary light source. Sets the mood.\n   • High angle key = authority, drama\n   • Low angle key = horror, unease\n   • Side key = mystery, film noir\n\n2. Fill Light — Fills in the shadows from the key. Controls contrast ratio.\n   • Bright fill = happy, sitcom, comedy\n   • Dim fill = moody, dramatic, thriller\n   • No fill = extreme drama, horror\n\n3. Rim/Back Light — Separates the subject from the background.\n   Creates a subtle edge glow that adds depth and dimension.\n\nContrast Ratios:\n• 2:1 (Key:Fill) = Bright, even, commercial\n• 4:1 = Standard dramatic lighting\n• 8:1 = High drama, film noir\n• ∞:1 = Silhouette',
      table: {
        headers: ['Mood', 'Key Position', 'Fill Ratio', 'Color Temp', 'Example Film'],
        rows: [
          ['Heroic', 'High 45°, warm', '2:1', '5600K (daylight)', 'The Incredibles'],
          ['Mysterious', 'Side, cool', '6:1', '7000K (blue)', 'Batman: TAS'],
          ['Romantic', 'Low, golden', '3:1', '3200K (warm)', 'Tangled'],
          ['Horror', 'Below, green', '10:1', '4000K (sickly)', 'Coraline'],
          ['Epic', 'Behind (rim dominant)', '4:1', 'Mixed', 'Spider-Verse'],
        ],
      },
    },
    {
      heading: '🖼️ PBR Texturing — Physically Based Rendering',
      content:
        'PBR (Physically-Based Rendering) simulates how real-world materials interact with light. This is the modern standard — used in every AAA game and VFX film.\n\nThe PBR Texture Stack:\n\n1. Base Color (Albedo) — The "paint" color without any lighting info\n2. Metallic — Is it metal (1.0) or non-metal (0.0)? Binary choice\n3. Roughness — How shiny? (0.0 = mirror, 1.0 = chalk)\n4. Normal Map — Fakes small surface details (bumps, pores, scratches)\n5. Ambient Occlusion (AO) — Darkens crevices where light can\'t reach\n6. Height/Displacement — Actually deforms geometry for large-scale detail\n\nTools: Substance 3D Painter is the industry standard for PBR texturing. Blender\'s built-in texture painting also works well for learning.',
    },
  ],
  codeBlocks: [
    {
      id: 'anim2-blender-rig',
      title: 'Step 1: Auto-Rig Setup in Blender (Python)',
      language: 'python',
      code: `import bpy
import mathutils

# ── Blender Python: Professional Rig Setup ────────────
# This script creates a basic humanoid armature with
# IK constraints — the foundation of a character rig.

def create_humanoid_rig(name="Character_Rig"):
    """
    Create a production-ready humanoid armature.
    Includes: Spine chain, Arms (IK/FK), Legs (IK), Head.
    """
    # Create new Armature
    bpy.ops.object.armature_add(enter_editmode=True)
    armature = bpy.context.active_object
    armature.name = name
    arm_data = armature.data
    arm_data.name = f"{name}_Data"
    
    # ── Clear default bone ─────────────────────────────
    bpy.ops.armature.select_all(action='SELECT')
    bpy.ops.armature.delete()
    
    # ── Helper: Create bone ────────────────────────────
    def add_bone(name, head, tail, parent_name=None):
        bone = arm_data.edit_bones.new(name)
        bone.head = mathutils.Vector(head)
        bone.tail = mathutils.Vector(tail)
        if parent_name and parent_name in arm_data.edit_bones:
            bone.parent = arm_data.edit_bones[parent_name]
            bone.use_connect = True
        return bone
    
    # ── Spine Chain ────────────────────────────────────
    add_bone("Root",      (0, 0, 0.95),  (0, 0, 1.0))
    add_bone("Spine_01",  (0, 0, 1.0),   (0, 0, 1.15),  "Root")
    add_bone("Spine_02",  (0, 0, 1.15),  (0, 0, 1.30),  "Spine_01")
    add_bone("Chest",     (0, 0, 1.30),  (0, 0, 1.45),  "Spine_02")
    add_bone("Neck",      (0, 0, 1.45),  (0, 0, 1.55),  "Chest")
    add_bone("Head",      (0, 0, 1.55),  (0, 0, 1.75),  "Neck")
    
    # ── Left Arm ───────────────────────────────────────
    clavicle_l = add_bone("Clavicle_L",  (0.05, 0, 1.42), (0.18, 0, 1.42), "Chest")
    clavicle_l.use_connect = False
    add_bone("UpperArm_L",  (0.18, 0, 1.42), (0.45, 0, 1.42), "Clavicle_L")
    add_bone("Forearm_L",   (0.45, 0, 1.42), (0.70, 0, 1.42), "UpperArm_L")
    add_bone("Hand_L",      (0.70, 0, 1.42), (0.80, 0, 1.42), "Forearm_L")
    
    # ── Right Arm (mirror) ─────────────────────────────
    clavicle_r = add_bone("Clavicle_R",  (-0.05, 0, 1.42), (-0.18, 0, 1.42), "Chest")
    clavicle_r.use_connect = False
    add_bone("UpperArm_R",  (-0.18, 0, 1.42), (-0.45, 0, 1.42), "Clavicle_R")
    add_bone("Forearm_R",   (-0.45, 0, 1.42), (-0.70, 0, 1.42), "UpperArm_R")
    add_bone("Hand_R",      (-0.70, 0, 1.42), (-0.80, 0, 1.42), "Forearm_R")
    
    # ── Left Leg ───────────────────────────────────────
    thigh_l = add_bone("Thigh_L", (0.10, 0, 0.95), (0.10, 0, 0.50), "Root")
    thigh_l.use_connect = False
    add_bone("Shin_L",  (0.10, 0, 0.50), (0.10, 0, 0.08), "Thigh_L")
    add_bone("Foot_L",  (0.10, 0, 0.08), (0.10, -0.12, 0.0), "Shin_L")
    add_bone("Toe_L",   (0.10, -0.12, 0.0), (0.10, -0.20, 0.0), "Foot_L")
    
    # ── Right Leg (mirror) ─────────────────────────────
    thigh_r = add_bone("Thigh_R", (-0.10, 0, 0.95), (-0.10, 0, 0.50), "Root")
    thigh_r.use_connect = False
    add_bone("Shin_R",  (-0.10, 0, 0.50), (-0.10, 0, 0.08), "Thigh_R")
    add_bone("Foot_R",  (-0.10, 0, 0.08), (-0.10, -0.12, 0.0), "Shin_R")
    add_bone("Toe_R",   (-0.10, -0.12, 0.0), (-0.10, -0.20, 0.0), "Foot_R")
    
    bpy.ops.object.mode_set(mode='OBJECT')
    print(f"✅ Humanoid rig '{name}' created successfully!")
    print(f"   Bones: {len(arm_data.bones)}")
    print(f"   Chains: Spine(6), Arms(4×2), Legs(4×2)")
    print(f"   Next: Add IK constraints in Pose Mode")
    
    return armature

# ── Create the rig ─────────────────────────────────────
rig = create_humanoid_rig("Hero_Character")`,
      troubleshooting: [
        { error: 'Bone created at wrong location', cause: 'Blender is in wrong coordinate space', fix: 'Ensure you\'re in Edit Mode with the armature selected before adding bones' },
        { error: '"Root" bone not found', cause: 'Bone names are case-sensitive', fix: 'Double-check exact spelling: "Root" not "root" or "ROOT"' },
      ],
    },
    {
      id: 'anim2-ik-setup',
      title: 'Step 2: IK Constraint Setup & Weight Painting',
      language: 'python',
      code: `import bpy

# ── IK (Inverse Kinematics) Setup ─────────────────────
# IK allows you to move the hand/foot and the entire
# arm/leg chain solves automatically.

def setup_ik_constraints(armature_name="Character_Rig"):
    """
    Add IK constraints to legs and create IK targets.
    IK targets are empty objects that the animator moves.
    """
    arm_obj = bpy.data.objects[armature_name]
    bpy.context.view_layer.objects.active = arm_obj
    bpy.ops.object.mode_set(mode='POSE')
    
    # ── Create IK Target for Left Foot ─────────────────
    bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.empty_add(
        type='PLAIN_AXES', location=(0.10, 0, 0.0)
    )
    ik_target_l = bpy.context.active_object
    ik_target_l.name = "IK_Foot_L"
    ik_target_l.empty_display_size = 0.1
    
    # ── Create IK Pole Target (controls knee direction)
    bpy.ops.object.empty_add(
        type='SPHERE', location=(0.10, -0.5, 0.50)
    )
    pole_l = bpy.context.active_object
    pole_l.name = "Pole_Knee_L"
    pole_l.empty_display_size = 0.05
    
    # ── Apply IK Constraint ────────────────────────────
    bpy.context.view_layer.objects.active = arm_obj
    bpy.ops.object.mode_set(mode='POSE')
    
    shin_bone = arm_obj.pose.bones["Shin_L"]
    ik_con = shin_bone.constraints.new('IK')
    ik_con.name = "IK_Leg_L"
    ik_con.target = ik_target_l
    ik_con.pole_target = pole_l
    ik_con.chain_count = 2           # Affects Thigh + Shin
    ik_con.pole_angle = 1.5708       # 90 degrees (π/2)
    
    bpy.ops.object.mode_set(mode='OBJECT')
    print("✅ IK constraint applied to left leg")
    print("   Chain Length: 2 (Thigh → Shin)")
    print("   Target: IK_Foot_L (move this to animate)")
    print("   Pole: Pole_Knee_L (points knee direction)")

# ── Weight Painting Best Practices ─────────────────────
WEIGHT_PAINTING_RULES = """
┌─────────────────────────────────────────────────────────┐
│              WEIGHT PAINTING CHEAT SHEET                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  RULE 1: Weights must sum to 1.0 per vertex            │
│  RULE 2: Max 4 bone influences per vertex (games)      │
│  RULE 3: Blend gradually — no hard weight boundaries    │
│  RULE 4: Test at EXTREME poses, not just rest pose     │
│                                                         │
│  ELBOW / KNEE (hinge joints):                          │
│  ├── Upper bone: gradient from 1.0 → 0.0               │
│  ├── Lower bone: gradient from 0.0 → 1.0               │
│  └── Crease line: 50/50 split (0.5 each)              │
│                                                         │
│  SHOULDER (ball joint — most complex!):                │
│  ├── Front: Chest + Arm blend                          │
│  ├── Side:  Pure Arm weight                            │
│  ├── Back:  Scapula influence                          │
│  └── Under: Careful blend to avoid collapse            │
│                                                         │
│  FACE (blendshapes preferred over bones):              │
│  ├── Jaw: Single bone, tight weights                   │
│  ├── Eyes: Bone per eye + blendshapes for blink        │
│  └── Lips/Cheeks: Blendshapes (NOT bone weights)      │
│                                                         │
│  DEBUGGING:                                             │
│  → Rotate bone 90° in Pose Mode                       │
│  → Check for: Mesh collapse, unwanted stretching       │
│  → Fix with: Smooth brush (Shift+click) in WP mode    │
│  → Normalise: Ctrl+N after major weight changes        │
└─────────────────────────────────────────────────────────┘
"""
print(WEIGHT_PAINTING_RULES)`,
      troubleshooting: [
        { error: 'IK leg bends backward (knee flips)', cause: 'Pole target is behind the knee', fix: 'Move the pole target IN FRONT of the knee — the pole vector controls bend direction' },
        { error: 'Mesh tears at shoulder when arm raised', cause: 'Weight painting has hard boundary between shoulder and arm', fix: 'Use the Smooth Weight brush (Shift+click) to blend the transition area' },
      ],
    },
    {
      id: 'anim2-lighting',
      title: 'Step 3: Cinematic Lighting Setup in Blender',
      language: 'python',
      code: `import bpy
import mathutils
import math

def create_cinematic_lighting(mood="dramatic"):
    """
    Create a professional 3-point lighting setup.
    Mood options: 'dramatic', 'heroic', 'mysterious', 'romantic'
    """
    # ── Clear existing lights ──────────────────────────
    for obj in bpy.data.objects:
        if obj.type == 'LIGHT':
            bpy.data.objects.remove(obj, do_unlink=True)
    
    # ── Mood Presets ───────────────────────────────────
    presets = {
        "dramatic": {
            "key_energy":   800,
            "key_color":    (1.0, 0.95, 0.85),    # Warm white
            "key_angle":    45,
            "fill_energy":  200,                    # 4:1 ratio
            "fill_color":   (0.7, 0.8, 1.0),       # Cool fill
            "rim_energy":   400,
            "rim_color":    (0.9, 0.95, 1.0),
            "bg_color":     (0.02, 0.02, 0.04),    # Near black
        },
        "heroic": {
            "key_energy":   1200,
            "key_color":    (1.0, 0.98, 0.9),
            "key_angle":    30,
            "fill_energy":  600,                    # 2:1 ratio
            "fill_color":   (0.85, 0.9, 1.0),
            "rim_energy":   800,
            "rim_color":    (1.0, 0.95, 0.8),
            "bg_color":     (0.1, 0.15, 0.25),
        },
        "mysterious": {
            "key_energy":   500,
            "key_color":    (0.6, 0.7, 1.0),       # Cool blue
            "key_angle":    80,                      # Side light
            "fill_energy":  80,                      # 6:1 ratio
            "fill_color":   (0.3, 0.4, 0.6),
            "rim_energy":   300,
            "rim_color":    (0.5, 0.6, 1.0),
            "bg_color":     (0.01, 0.01, 0.03),
        },
    }
    
    p = presets.get(mood, presets["dramatic"])
    
    # ── Key Light ──────────────────────────────────────
    bpy.ops.object.light_add(type='AREA', location=(2, -2, 3))
    key = bpy.context.active_object
    key.name = "Key_Light"
    key.data.energy = p["key_energy"]
    key.data.color = p["key_color"]
    key.data.size = 1.5            # Soft shadows
    key.data.use_shadow = True
    
    # Point at origin (character position)
    direction = mathutils.Vector((0, 0, 1.4)) - key.location
    rot = direction.to_track_quat('-Z', 'Y')
    key.rotation_euler = rot.to_euler()
    
    # ── Fill Light ─────────────────────────────────────
    bpy.ops.object.light_add(type='AREA', location=(-2.5, -1.5, 2))
    fill = bpy.context.active_object
    fill.name = "Fill_Light"
    fill.data.energy = p["fill_energy"]
    fill.data.color = p["fill_color"]
    fill.data.size = 3.0           # Very soft (diffuse fill)
    fill.data.use_shadow = False   # Fill typically casts no shadow
    
    direction = mathutils.Vector((0, 0, 1.2)) - fill.location
    rot = direction.to_track_quat('-Z', 'Y')
    fill.rotation_euler = rot.to_euler()
    
    # ── Rim / Back Light ───────────────────────────────
    bpy.ops.object.light_add(type='AREA', location=(0.5, 3, 2.5))
    rim = bpy.context.active_object
    rim.name = "Rim_Light"
    rim.data.energy = p["rim_energy"]
    rim.data.color = p["rim_color"]
    rim.data.size = 0.8            # Sharper rim edge
    
    direction = mathutils.Vector((0, 0, 1.4)) - rim.location
    rot = direction.to_track_quat('-Z', 'Y')
    rim.rotation_euler = rot.to_euler()
    
    # ── World / Background ─────────────────────────────
    world = bpy.data.worlds["World"]
    world.use_nodes = True
    bg_node = world.node_tree.nodes["Background"]
    bg_node.inputs[0].default_value = (*p["bg_color"], 1.0)
    bg_node.inputs[1].default_value = 0.3   # Low ambient
    
    # ── Render Settings ────────────────────────────────
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 256
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.film_transparent = True   # Alpha channel
    
    print(f"✅ Cinematic '{mood}' lighting created!")
    print(f"   Key:  {p['key_energy']}W at {p['key_angle']}°")
    print(f"   Fill: {p['fill_energy']}W (ratio {p['key_energy']//p['fill_energy']}:1)")
    print(f"   Rim:  {p['rim_energy']}W")
    print(f"   Render: Cycles, 256 samples, denoised")

create_cinematic_lighting("dramatic")`,
      troubleshooting: [
        { error: 'Scene is completely black', cause: 'Lights have zero energy or are inside objects', fix: 'Check light energy values (should be 100+) and ensure lights are outside the character mesh' },
        { error: 'Render has firefly noise artifacts', cause: 'Insufficient samples or caustic reflections', fix: 'Increase samples to 512+, enable denoising, and clamp indirect light to 10' },
      ],
    },
  ],
  project: {
    title: 'Rigged Character with Cinematic Lighting Portfolio Shot',
    description:
      'Create a fully rigged 3D character with proper topology, IK/FK switching, weight painting, AND a dramatic cinematic lighting setup. Render a hero shot suitable for a professional portfolio.',
    code: {
      id: 'anim2-project',
      title: 'Character Rig & Lighting — Production Checklist',
      language: 'markdown',
      code: `# ── DELIVERABLES ──────────────────────────────────────
# 1. Rigged character (.blend or .ma file)
# 2. Three cinematic renders (different moods)
# 3. Topology wireframe overlay render
# 4. Weight painting verification video

# ── MODEL REQUIREMENTS ────────────────────────────────
# Polycount:    8,000 — 25,000 tris (game-ready)
# Topology:     100% quads on deforming areas
# Edge Loops:   Eyes(2+), Mouth(2+), Elbows(3+), Knees(3+)
# UV Unwrap:    Clean, no overlapping, proper texel density
# Textures:     PBR stack (Base Color, Roughness, Normal, AO)

# ── TOPOLOGY CHECKLIST ────────────────────────────────
# □ All quads on face, arms, legs, torso
# □ Edge loops follow muscle flow
# □ No triangles on ANY joint or deforming area
# □ Poles (5-edge vertices) placed ONLY on flat areas
# □ Even quad density across the entire mesh
# □ Passes the "subdivision test" (Ctrl+1 looks clean)

# ── RIG REQUIREMENTS ─────────────────────────────────
# □ Full skeleton: Spine(4+), Arms(3+), Legs(3+), Head
# □ IK on legs with pole vectors (knee targets)
# □ FK chain on arms (with optional IK switch)
# □ Custom bone shapes (circles, cubes — not raw bones)
# □ All transforms zeroed in rest pose
# □ Bones on correct layers (Deform vs Control)

# ── WEIGHT PAINTING VERIFICATION ─────────────────────
# □ Raise arm to 90° — no shoulder collapse
# □ Bend elbow to 120° — smooth crease, no pinching
# □ Bend knee fully — no mesh intersection
# □ Twist forearm 90° — clean twist deformation
# □ Turn head 45° left/right — neck deforms naturally
# □ All weights normalised (sum = 1.0 per vertex)

# ── LIGHTING DELIVERABLES ─────────────────────────────
# □ Render 1: "Heroic" mood (warm key, bright fill)
# □ Render 2: "Mysterious" mood (cool side light)
# □ Render 3: "Dramatic" mood (strong key:fill ratio)
# □ All renders: 1920×1080, PNG with alpha, denoised
# □ Post-processing: Subtle color grade, vignette`,
      troubleshooting: [
        { error: 'Mesh pinches at elbow when bending', cause: 'Not enough edge loops at the joint', fix: 'Add 2-3 parallel edge loops at the elbow crease with Ctrl+R in Edit Mode' },
        { error: 'Subdivided model has lumps/artifacts', cause: 'N-gons or poles on curved surfaces', fix: 'Select all → Mesh → Clean Up → Tris to Quads, then manually fix remaining issues' },
      ],
    },
  },
};

// ── MODULE 3 ─────────────────────────────────────────────
const animModule3: CourseModule = {
  slug: 'cgi-vfx-houdini',
  number: 3,
  title: 'CGI & Visual Effects',
  subtitle: 'Particles, Simulations & Houdini',
  emoji: '💥',
  color: 'from-orange-500 to-amber-400',
  objective: [
    'Understand the VFX pipeline used in blockbuster films — from plate photography to final composite.',
    'Master particle systems — create fire, smoke, debris, and magic effects.',
    'Learn physics-based fluid and destruction simulations in Houdini.',
    'Build a complete CG environment with VFX elements composited into live-action footage.',
  ],
  estimatedHours: '14–18 hours',
  difficulty: 'Intermediate',
  prerequisites: ['Module 2 completed', 'Basic Blender/Maya skills', 'Understanding of 3D rendering from Module 2'],
  tags: ['Houdini', 'Particles', 'Fluid Sim', 'Destruction', 'VEX', 'Compositing', 'FLIP Solver', 'Pyro'],
  theorySections: [
    {
      heading: '🎬 The VFX Pipeline — How Blockbusters Are Made',
      content:
        'When you watch the Avengers destroy a city, every frame is a carefully orchestrated pipeline:\n\n1. On-Set Photography — Live-action plates with tracking markers\n2. Matchmove/Camera Tracking — Recreate the real camera movement in 3D\n3. Layout — Place CG elements in the tracked 3D scene\n4. Modeling — Build the 3D assets (buildings, debris, creatures)\n5. Rigging & Animation — Bring characters to life\n6. Effects (FX) — Simulations: fire, water, destruction, particles\n7. Lighting — Match CG lighting to the real-world plate\n8. Rendering — Generate final CG frames (can take hours PER FRAME)\n9. Compositing — Layer CG renders over live-action plates\n10. Color Grading — Final color adjustment for mood\n\nAt ILM or Weta, each step is handled by specialized departments with 50-200+ artists.',
    },
    {
      heading: '✨ Particle Systems — The Building Blocks of FX',
      content:
        'A particle system generates thousands (or millions) of tiny points that follow physics rules. By changing how they\'re born, how they move, and how they look, you can create almost ANY effect.\n\nAnatomy of a Particle System:\n\n• Emitter — WHERE particles are born (point, surface, volume)\n• Birth Rate — HOW MANY particles per second\n• Lifetime — How long each particle lives before dying\n• Velocity — Initial speed and direction\n• Forces — Gravity, wind, turbulence, attraction\n• Collision — What happens when particles hit objects\n• Rendering — How particles LOOK (points, sprites, mesh instances)',
      table: {
        headers: ['Effect', 'Particle Type', 'Key Forces', 'Render Style'],
        rows: [
          ['Fire', 'Volume (Pyro)', 'Buoyancy, turbulence', 'Volume shader (emission)'],
          ['Smoke', 'Volume (Pyro)', 'Buoyancy, wind, dissipation', 'Volume shader (scatter)'],
          ['Sparks', 'Points', 'Gravity, drag, bounce', 'Sprite or point cloud'],
          ['Rain', 'Streaks', 'Gravity, wind', 'Motion-blurred lines'],
          ['Debris', 'RBD pieces', 'Gravity, collision, friction', 'Instanced geometry'],
          ['Magic/Energy', 'Points + trails', 'Curl noise, attraction', 'Sprites + glow post-FX'],
        ],
      },
    },
    {
      heading: '🌊 Fluid Simulation — FLIP Solver',
      content:
        'Fluid simulations are among the most computationally expensive effects in VFX. The industry standard is the FLIP (Fluid-Implicit Particles) solver, which combines the best of grid-based and particle-based methods.\n\nHow FLIP works (simplified):\n1. Represent fluid as millions of particles\n2. Transfer particle velocities to a grid\n3. Solve pressure on the grid (incompressibility)\n4. Transfer corrected velocities back to particles\n5. Move particles forward in time\n6. Repeat every frame\n\nWhy FLIP over pure SPH (Smoothed Particle Hydrodynamics)?\n• Better preserves fine details and splashes\n• More stable at high velocities\n• Industry proven (used in Pirates of the Caribbean, Moana, Avatar)\n\nHoudini\'s FLIP solver is the industry standard. Blender\'s Mantaflow is great for learning.',
    },
    {
      heading: '💣 Rigid Body Destruction (RBD)',
      content:
        'Destruction simulations use Voronoi fracturing to break objects into realistic chunks, then simulate those chunks as rigid bodies with physics.\n\nThe Destruction Pipeline:\n\n1. Model the "hero" object (building, wall, bridge)\n2. Voronoi Fracture — Cut the mesh into pieces using random seed points\n3. Constraint Network — Define how pieces are connected (glue, hinge, spring)\n4. Apply Force — Impact point, explosion, gravity\n5. Simulate — RBD solver handles collision, friction, stacking\n6. Secondary FX — Add dust, sparks, debris particles\n7. Render — Per-piece motion blur, displacement cracking\n\nKey parameters:\n• Fracture density: More pieces = more realistic but slower\n• Glue strength: How much force needed to break connections\n• Friction: How pieces slide against each other\n• Bounce: Elasticity of collisions',
    },
    {
      heading: '🔧 Houdini — The Procedural Powerhouse',
      content:
        'Houdini is fundamentally different from Maya or Blender. Instead of manually sculpting and placing objects, EVERYTHING in Houdini is a node-based procedure — a recipe that can be modified at any point.\n\nKey Houdini Concepts:\n\n• SOP (Surface Operators) — Geometry manipulation nodes\n• DOP (Dynamic Operators) — Physics simulations\n• VOP (VEX Operators) — Visual shader/math nodes\n• VEX — Houdini\'s built-in scripting language (like HLSL for FX)\n• Digital Assets (HDA) — Reusable procedural tools you create\n\nWhy Studios Use Houdini for FX:\n1. Non-destructive: Change any parameter at any time\n2. Procedural: One setup can generate infinite variations\n3. Scalable: Handle millions of particles efficiently\n4. Art-directable: Fine-tune simulations without restarting\n5. Pipeline-friendly: Exports to any renderer/compositor',
    },
  ],
  codeBlocks: [
    {
      id: 'anim3-vex-particles',
      title: 'Step 1: Houdini VEX — Custom Particle Behavior',
      language: 'c',
      code: `// ── Houdini VEX: Custom Particle Forces ──────────────
// VEX is Houdini's high-performance scripting language.
// It runs per-point/particle and is FAST.
//
// Apply this in a Point Wrangle SOP.

// ── 1. Curl Noise Force (Organic Swirling Motion) ─────
// Creates beautiful, non-repeating turbulent motion.
// Used for: smoke trails, magic effects, energy swirls.

float freq = chf("noise_frequency");  // User slider (0.5-3.0)
float amp  = chf("noise_amplitude");  // User slider (0.1-2.0)
float time_offset = @Time * chf("noise_speed");

// 3D Curl Noise — divergence-free (no convergence points)
vector noise_pos = @P * freq + set(0, time_offset, 0);
vector curl = curlnoise(noise_pos);

// Apply as force (multiply by amplitude)
@v += curl * amp * @TimeInc;

// ── 2. Age-Based Particle Behavior ────────────────────
// Make particles change behavior as they age.

float life_ratio = @age / @life;  // 0.0 (birth) → 1.0 (death)

// Fade out opacity as particle dies
@Alpha = fit(life_ratio, 0.7, 1.0, 1.0, 0.0);

// Grow particle size over lifetime
@pscale = fit(life_ratio, 0.0, 0.3, 0.01, 0.1) 
        * fit(life_ratio, 0.7, 1.0, 1.0, 0.0);

// Color shift: blue (birth) → orange (mid) → red (death)
vector color_young = set(0.2, 0.5, 1.0);  // Blue
vector color_mid   = set(1.0, 0.5, 0.1);  // Orange
vector color_old   = set(1.0, 0.1, 0.05); // Red

if (life_ratio < 0.5) {
    @Cd = lerp(color_young, color_mid, life_ratio * 2);
} else {
    @Cd = lerp(color_mid, color_old, (life_ratio - 0.5) * 2);
}

// ── 3. Attraction to Target ───────────────────────────
// Particles gravitate toward a target point.
// Used for: energy gathering, implosion effects.

vector target = chv("target_position");  // User input
float attract_strength = chf("attraction");

vector dir_to_target = normalize(target - @P);
float dist = length(target - @P);

// Strength increases as particle gets closer (inverse square)
float force = attract_strength / (dist * dist + 0.01);
@v += dir_to_target * force * @TimeInc;

// ── 4. Ground Collision (Simple) ──────────────────────
float ground_y = 0.0;
float bounce = chf("bounciness");  // 0.0-1.0

if (@P.y < ground_y) {
    @P.y = ground_y;
    @v.y = abs(@v.y) * bounce;  // Reflect Y velocity
    @v.x *= 0.9;  // Friction
    @v.z *= 0.9;
}`,
      troubleshooting: [
        { error: 'Particles explode / fly to infinity', cause: 'Force multiplier too high or missing TimeInc', fix: 'Always multiply forces by @TimeInc for frame-rate independent motion' },
        { error: 'curlnoise() not found', cause: 'Wrong Houdini version or context', fix: 'Ensure you\'re in a Point Wrangle SOP (not Detail or Primitive), Houdini 18+' },
      ],
    },
    {
      id: 'anim3-pyro',
      title: 'Step 2: Pyro FX — Fire & Smoke Setup',
      language: 'c',
      code: `// ── Houdini Pyro Simulation Setup ─────────────────────
// Pyro uses volume grids to simulate fire, smoke, and
// explosions. This is the setup used on major films.

// ── STEP 1: Source Setup (Point Wrangle on emitter) ───
// Define what the source emits into the pyro sim.

// Temperature drives fire (combustion)
@temperature = 1.5;          // Higher = hotter flames
@temperature *= rand(@id);   // Randomise per-point

// Density = smoke thickness
@density = 0.8;

// Fuel = what burns (consumed by combustion)
@fuel = 1.0;

// Emission velocity (upward + outward burst)
@v = set(0, 3.0, 0);                    // Base upward velocity
@v += normalize(@P) * 2.0;              // Outward burst
@v += curlnoise(@P * 0.5 + @Time) * 1.0; // Turbulence

// ── STEP 2: Pyro Solver Settings (DOP Network) ───────
// These are the key parameters to art-direct fire/smoke.
// Set these on the Pyro Solver DOP node.

// COMBUSTION:
//   burn_rate = 0.8         High = fast burn, Low = lingering
//   flame_height = 1.5      How tall flames reach
//   temperature_diffusion = 0.02   How fast heat spreads

// DISSIPATION (smoke fading):
//   density_dissipation = 0.01    Low = thick smoke, High = wispy
//   temperature_cooling = 0.5     How fast fire cools to smoke

// TURBULENCE (organic detail):
//   turbulence_strength = 0.5     Swirling motion intensity
//   turbulence_scale = 0.3        Size of swirl features
//   turbulence_speed = 0.2        How fast swirls evolve

// BUOYANCY:
//   buoyancy_direction = {0, 1, 0}   Upward
//   buoyancy_strength = 1.0          How strongly heat rises

// RESOLUTION:
//   division_size = 0.05    Grid cell size (smaller = more detail)
//   substeps = 2            Temporal accuracy (increase for fast motion)

// ── STEP 3: Volume Shader (Material) ─────────────────
// RenderMan / Mantra / Arnold volume shader settings:
//
// Fire: Emit light based on temperature field
//   emission_color = blackbody(temperature * 6500)
//   emission_intensity = fit(temperature, 0.1, 1.5, 0, 50)
//
// Smoke: Scatter light through density field
//   scatter_color = {0.3, 0.3, 0.35}
//   density_multiplier = 2.0
//   shadow_density = 4.0 (smoke casts dense shadows)

// ── PRO TIPS ─────────────────────────────────────────
// 1. Low-res sim first (division_size=0.2), then increase
// 2. Cache to disk ALWAYS (.vdb format)
// 3. Use "Gas Resize Fluid Dynamic" to auto-grow bounds
// 4. Upres pass: sim low-res, add detail in post
// 5. Real fire reference is ESSENTIAL — study slow-mo videos`,
      troubleshooting: [
        { error: 'Simulation container (box) is visible in render', cause: 'Bounding box not auto-resizing', fix: 'Add "Gas Resize Fluid Dynamic" DOP, set padding to 0.2+' },
        { error: 'Fire looks like colored smoke (no light emission)', cause: 'Volume shader not configured for emission', fix: 'Enable "Emit Light" on the Pyro shader, set emission = temperature field' },
      ],
    },
    {
      id: 'anim3-compositing',
      title: 'Step 3: Compositing CG into Live-Action',
      language: 'python',
      code: `# ── Nuke/After Effects Compositing Workflow ───────────
# This script demonstrates the compositing pipeline
# for integrating CG renders over live-action plates.

# ── Render Passes (AOVs) Required ─────────────────────
# Modern VFX compositing uses SEPARATE render passes
# (called AOVs — Arbitrary Output Variables) that give
# the compositor complete control in post.

RENDER_PASSES = {
    "beauty":       "Final combined render (fallback)",
    "diffuse":      "Flat color without reflections/shadows",
    "specular":     "Reflections and highlights only",
    "emission":     "Self-illuminating elements (fire, screens)",
    "shadow":       "Shadow contribution (multiply over plate)",
    "ambient_occ":  "Contact shadows in crevices",
    "normal":       "Surface direction (for relighting in comp)",
    "depth":        "Z-depth (for depth-of-field, fog)",
    "motion":       "Per-pixel motion vectors (motion blur)",
    "matte":        "Object isolation masks (ID mattes)",
    "crypto":       "Cryptomatte (per-object/material masks)",
}

print("📦 Required Render Passes for Film-Quality VFX:")
print("=" * 55)
for pass_name, description in RENDER_PASSES.items():
    print(f"  {pass_name:15s} → {description}")

# ── Compositing Layer Order ───────────────────────────
COMP_STACK = """
┌─────────────────────────────────────────────────────┐
│           COMPOSITING STACK (Bottom → Top)          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Layer 1: PLATE (Live-action footage)              │
│    ├── Lens distortion correction                  │
│    ├── De-grain (noise removal)                    │
│    └── Color correction to linear colorspace       │
│                                                     │
│  Layer 2: SHADOW PASS (Multiply blend)             │
│    └── CG shadows cast onto real environment       │
│                                                     │
│  Layer 3: CG BEAUTY (Over blend with alpha)        │
│    ├── Color match to plate (exposure, white bal.)  │
│    ├── Edge integration (light wrap / spill)       │
│    └── Contact shadows (AO pass)                   │
│                                                     │
│  Layer 4: ATMOSPHERE (Add/Screen blend)            │
│    ├── Depth fog (from Z-depth pass)               │
│    ├── Volumetric light rays                       │
│    └── Lens flares (if applicable)                 │
│                                                     │
│  Layer 5: EFFECTS (Add blend)                      │
│    ├── Fire/sparks emission                        │
│    ├── Light interaction on plate (re-light)       │
│    └── Motion blur (from motion vectors)           │
│                                                     │
│  Layer 6: FINAL (Output)                           │
│    ├── Re-grain (match original film grain)        │
│    ├── Lens distortion (re-apply)                  │
│    ├── Color grade                                 │
│    └── Output: 16-bit EXR or DPX                   │
│                                                     │
└─────────────────────────────────────────────────────┘
"""
print(COMP_STACK)

# ── Color Space Management ────────────────────────────
print("🎨 Color Space Rules (ACES Pipeline):")
print("  • Work in Linear (scene-referred) colorspace")
print("  • Textures: Convert sRGB → ACEScg on import")
print("  • Renders: Output as 32-bit EXR (full dynamic range)")
print("  • Display: Apply ACES Output Transform for viewing")
print("  • Delivery: Rec.709 (web/TV) or DCI-P3 (cinema)")`,
      troubleshooting: [
        { error: 'CG object looks "pasted on" — doesn\'t match plate', cause: 'Color space mismatch or missing light wrap', fix: 'Ensure CG is rendered in ACEScg and plate is linearised. Add edge light wrap (glow spill from background onto CG edges).' },
        { error: 'CG shadows too sharp vs live-action', cause: 'CG light is a point source', fix: 'Use Area lights in CG to match real soft-shadow behavior. Blur shadow pass in comp.' },
      ],
    },
  ],
  project: {
    title: 'CG Explosion Integrated into Live-Action Footage',
    description:
      'Film a simple plate (static shot of a wall/ground), track the camera, and composite a Houdini destruction + pyro simulation seamlessly into the footage. This is the exact workflow used on Marvel, Transformers, and Godzilla.',
    code: {
      id: 'anim3-project',
      title: 'VFX Shot — Production Checklist',
      language: 'markdown',
      code: `# ── DELIVERABLES ──────────────────────────────────────
# 1. Live-action plate (5-10 seconds, static or tracked)
# 2. Camera track solution (exported .abc or .fbx)
# 3. Houdini simulation cache (.vdb for volumes, .bgeo for RBD)
# 4. Multi-pass CG render (EXR, minimum 8 passes)
# 5. Final composite (ProRes 4444 or EXR sequence)
# 6. Breakdown showing plate → CG → final

# ── PLATE PHOTOGRAPHY ─────────────────────────────────
# □ Shoot at consistent exposure (no auto mode!)
# □ Include tracking markers if camera moves
# □ Shoot a chrome ball and grey ball for lighting ref
# □ Record lens focal length and sensor size
# □ Shoot at 24fps, 1/48 shutter (180° shutter rule)

# ── HOUDINI FX REQUIREMENTS ──────────────────────────
# □ Voronoi fractured hero object (200-500 pieces)
# □ Constraint network with glue strength variation
# □ RBD simulation with proper collision geometry
# □ Pyro simulation for fire/smoke (explosion)
# □ Debris particles (small chunks + dust)
# □ Ground interaction (dust puff on debris impact)

# ── RENDER REQUIREMENTS ──────────────────────────────
# □ AOVs: beauty, diffuse, specular, shadow, depth, 
#          normal, motion, emission, AO, matte
# □ 32-bit EXR format (full dynamic range)
# □ Motion blur enabled (from simulation velocities)
# □ Render resolution matches plate exactly
# □ Frame range aligned to plate timecode

# ── COMPOSITING REQUIREMENTS ─────────────────────────
# □ Color space: ACEScg throughout pipeline
# □ Shadow pass multiplied over plate
# □ Light wrap on CG element edges
# □ Depth fog matches plate atmosphere
# □ Re-grain applied (match plate grain structure)
# □ Lens distortion matched to plate
# □ Final output: 16-bit + display LUT applied

# ── GRADING RUBRIC ────────────────────────────────────
# Integration Quality     30%  (Does CG look REAL?)
# Simulation Quality      25%  (Physics believable?)
# Technical Pipeline      20%  (Correct AOVs, color space)
# Artistic Direction      15%  (Timing, scale, drama)
# Presentation            10%  (Breakdown, final delivery)`,
      troubleshooting: [
        { error: 'Tracking solve has high error (>1 pixel)', cause: 'Insufficient tracking points or bad footage', fix: 'Use 8+ well-distributed trackers, ensure footage has texture and contrast for tracking' },
        { error: 'RBD pieces intersect through the ground', cause: 'Collision geometry too low-res', fix: 'Add a static ground plane as collision object in DOPs with sufficient resolution' },
      ],
    },
  },
};

// ── MODULE 4 ─────────────────────────────────────────────
const animModule4: CourseModule = {
  slug: 'realtime-rendering-ue5',
  number: 4,
  title: 'Real-Time Rendering',
  subtitle: 'Unreal Engine 5 & Cinematic Storytelling',
  emoji: '🎮',
  color: 'from-sky-500 to-blue-500',
  objective: [
    'Master Unreal Engine 5\'s core rendering technologies: Nanite, Lumen, Virtual Shadow Maps.',
    'Create photorealistic environments using Megascans and Quixel Bridge.',
    'Build cinematic sequences using UE5\'s Sequencer for professional film-quality output.',
    'Understand the MetaHuman pipeline for creating photorealistic digital humans.',
    'Render a complete cinematic short film entirely in real-time.',
  ],
  estimatedHours: '12–18 hours',
  difficulty: 'Advanced',
  prerequisites: ['Modules 1-3 completed', 'Basic 3D skills from previous modules', 'PC with GPU (RTX 2060+ recommended for Lumen)'],
  tags: ['Unreal Engine 5', 'Nanite', 'Lumen', 'Sequencer', 'MetaHuman', 'Megascans', 'Cinematic', 'Blueprint'],
  theorySections: [
    {
      heading: '🎮 Why Real-Time Rendering Changes Everything',
      content:
        'Traditional VFX rendering (offline) can take 1-24 HOURS per frame. A 2-minute short at 24fps = 2,880 frames = weeks of render time on a server farm.\n\nUnreal Engine 5 renders the SAME quality in milliseconds — 60 frames per second, in real-time. This isn\'t just about speed; it fundamentally changes how we create:\n\n• Instant feedback: See lighting, camera, and material changes LIVE\n• Virtual production: LED wall stages (The Mandalorian, The Batman)\n• Interactive experiences: Games, VR, AR, architectural viz\n• Faster iteration: Try 100 camera angles in the time offline does 1\n\nThe film industry is rapidly adopting real-time engines. Understanding UE5 is no longer optional — it\'s a career requirement.',
    },
    {
      heading: '⚡ Nanite — Infinite Geometry Detail',
      content:
        'Nanite is UE5\'s virtualized micropolygon geometry system. In plain English: it can handle BILLIONS of polygons with zero performance impact.\n\nHow it works:\n1. Import a 50-million polygon photoscan — Nanite doesn\'t care\n2. At runtime, Nanite streams only the triangles visible to the camera\n3. Distant objects automatically drop to fewer polygons\n4. No manual LOD (Level of Detail) creation needed\n5. Only pixel-sized triangles are rendered — no wasted geometry\n\nWhat this means:\n• No more LOD chains (LOD0, LOD1, LOD2...)\n• Import film-quality assets directly into real-time\n• Megascans photogrammetry works at full resolution\n• Focus on ART, not technical optimization',
      table: {
        headers: ['Before Nanite', 'With Nanite'],
        rows: [
          ['Manual LOD creation (hours per asset)', 'Zero LOD work — automatic'],
          ['Budget: ~1M triangles per scene', 'Budget: BILLIONS of triangles'],
          ['Pop-in artifacts at LOD transitions', 'Seamless, invisible streaming'],
          ['Simplified game-res models', 'Film-quality models in real-time'],
          ['Artist time spent on optimization', 'Artist time spent on creation'],
        ],
      },
    },
    {
      heading: '☀️ Lumen — Dynamic Global Illumination',
      content:
        'Lumen is UE5\'s fully dynamic global illumination and reflection system. Translation: realistic light bouncing WITHOUT baking.\n\nTraditional engines require "baking" — pre-calculating where light bounces, which takes hours and can\'t change at runtime. Lumen does this IN REAL-TIME.\n\nHow Lumen lights a scene:\n1. Primary light hits surfaces (direct illumination)\n2. Light bounces off surfaces into shadows (indirect illumination)\n3. Color bleeds — a red wall tints nearby objects pink\n4. Emissive surfaces light up surroundings (a neon sign illuminates the street)\n5. Sky light fills gaps (ambient)\n6. All of this updates EVERY FRAME at 60fps\n\nLumen has two modes:\n• Software Ray Tracing — Runs on ANY GPU (recommended starting point)\n• Hardware Ray Tracing — Uses RTX cores for higher quality + reflections',
    },
    {
      heading: '🎬 Sequencer — UE5\'s Film Director Tool',
      content:
        'The Sequencer is UE5\'s non-linear animation/cinematography tool. Think of it as a timeline editor INSIDE the game engine.\n\nWith Sequencer you can:\n• Animate cameras with professional controls (focus pull, FOV, crane moves)\n• Trigger animations, particles, and audio on timeline tracks\n• Switch between multiple cameras (multi-cam editing)\n• Add fades, color grades, and post-processing per shot\n• Export to movie files (PNG sequence, ProRes, H.264)\n\nReal-time rendering + Sequencer = you can create an entire animated short film without offline rendering. "The Matrix Awakens" demo was made this way.',
    },
    {
      heading: '👤 MetaHuman — Photorealistic Digital Humans',
      content:
        'MetaHuman Creator lets you build film-quality digital humans in minutes, not months.\n\nWhat you get:\n• Fully rigged face with 200+ blend shapes (facial expressions)\n• Strand-based hair simulation (individual hair strands!)\n• PBR skin shading (subsurface scattering for skin translucency)\n• Full body with clothing and animation-ready skeleton\n• LOD system from cinematic close-up to distant game view\n\nThe Pipeline:\n1. Design your character in MetaHuman Creator (web app)\n2. Download to UE5 via Quixel Bridge\n3. Animate with facial motion capture (Live Link Face app — free!)\n4. Or use hand-keyed animation on the blend shape rig\n5. Render in Sequencer with Lumen lighting\n\nThis technology would have cost $500,000+ and taken a team of 20 artists just 5 years ago. Now it\'s free.',
    },
  ],
  codeBlocks: [
    {
      id: 'anim4-ue5-setup',
      title: 'Step 1: UE5 Environment Setup with Megascans',
      language: 'cpp',
      code: `// ── UE5 C++ / Blueprint: Environment Setup Guide ─────
// While UE5 is primarily visual (Blueprint), understanding
// the underlying systems makes you a better technical artist.

// ── PROJECT SETTINGS (must configure first!) ──────────
// 1. Rendering:
//    Global Illumination Method: Lumen
//    Reflection Method: Lumen
//    Shadow Map Method: Virtual Shadow Maps
//    Anti-Aliasing: TSR (Temporal Super Resolution)
//
// 2. Nanite:
//    Enable Nanite: ✓ (Project Settings → Rendering)
//    Nanite on imported meshes: auto-enabled for >1000 tris
//
// 3. Post Process Volume (add one that covers entire level):
//    Exposure: Manual (ISO 100, Aperture f/2.8)
//    Bloom: Intensity 0.5, Threshold 1.0
//    Vignette: 0.3
//    Film Grain: 0.05 (subtle, cinematic)

// ── MEGASCANS WORKFLOW ────────────────────────────────
// 1. Open Quixel Bridge (built into UE5)
// 2. Browse and download assets:
//    - Surfaces (ground textures, walls, floors)
//    - 3D Assets (rocks, trees, debris, props)
//    - Decals (cracks, stains, moss, graffiti)
// 3. Drag assets into viewport
// 4. Nanite auto-enables on complex meshes
// 5. Materials are pre-configured PBR

// ── LUMEN LIGHTING SETUP ──────────────────────────────
// For a cinematic outdoor scene:
//
// 1. Directional Light (Sun):
//    Intensity: 10.0 lux
//    Color Temp: 5500K (warm) or 7000K (overcast)
//    Source Angle: 0.5-2.0 (soft shadows)
//    Atmosphere Sun Light: ✓
//
// 2. Sky Light:
//    Real Time Capture: ✓ (captures sky + bounced light)
//    Intensity: 1.0
//
// 3. Sky Atmosphere:
//    Use defaults — UE5's sky system is physically accurate
//
// 4. Exponential Height Fog:
//    Fog Density: 0.02
//    Start Distance: 1000
//    Inscattering Color: Match sky horizon color

// ── BLUEPRINT: Camera Cinematic Rig ───────────────────
// Create a Blueprint Actor with these components:
//
// Components:
//   SceneRoot
//   ├── CraneBoom (SpringArm)
//   │   └── CameraComponent
//   ├── FocusTarget (empty actor reference)
//   └── Timeline (for animated camera moves)
//
// Variables:
//   - FocalLength : float = 35.0 (mm)
//   - Aperture    : float = 2.8  (f-stop, controls DOF)
//   - FocusDist   : float = 300  (cm, auto-focus distance)
//   - BoomLength  : float = 500  (crane arm length)
//   - BoomPitch   : float = -15  (look-down angle)

// ── POST-PROCESS PRESETS ──────────────────────────────
// Cinematic Film Look:
//   Color Grading:
//     Shadows   → slight blue tint  (0.95, 0.95, 1.05)
//     Midtones  → neutral           (1.0, 1.0, 1.0)
//     Highlights → warm push        (1.05, 1.02, 0.95)
//   Tone Curve:
//     Toe: 0.55 (lift shadows slightly — no pure black)
//     Shoulder: 0.26 (smooth highlight rolloff)
//   Film Emulation:
//     Slope: 0.88, Toe: 0.55, Shoulder: 0.26, BlackClip: 0.0`,
      troubleshooting: [
        { error: 'Scene is pitch black with Lumen', cause: 'No light sources in the level', fix: 'Add a Directional Light (sun) and Sky Light with Real Time Capture enabled' },
        { error: 'Nanite meshes appear invisible', cause: 'Nanite not enabled in project settings', fix: 'Go to Project Settings → Rendering → Enable Nanite. Restart editor.' },
      ],
    },
    {
      id: 'anim4-sequencer',
      title: 'Step 2: Cinematic Sequencer — Multi-Camera Setup',
      language: 'cpp',
      code: `// ── UE5 Sequencer: Cinematic Sequence Setup ──────────
// The Sequencer is your film editor inside UE5.
// Here's how to set up a professional multi-camera sequence.

// ── STEP 1: Create a Level Sequence ───────────────────
// Content Browser → Right Click → Cinematics → Level Sequence
// Name it: "SC_010" (Scene 010 — production naming convention)
//
// Scene/Shot Naming Convention (Film Industry):
//   SC_010_SH_020 = Scene 10, Shot 20
//   Numbering by 10s allows inserting shots later

// ── STEP 2: Add Camera Cuts Track ─────────────────────
// In Sequencer: + Track → Camera Cut Track
// This controls WHICH camera is active at each moment.

// ── STEP 3: Create Cameras ────────────────────────────
// For each shot, create a CineCamera Actor:
//
// Camera A — "Wide Establishing" (Master Shot):
//   Focal Length: 24mm
//   Aperture: f/5.6 (deep focus — everything sharp)
//   Sensor: Super 35mm (24.89 × 18.66mm)
//
// Camera B — "Medium Close-Up" (Dialogue):
//   Focal Length: 50mm
//   Aperture: f/2.8 (shallow DOF — subject isolation)
//   Focus: Auto-track to character
//
// Camera C — "Close-Up" (Emotion/Detail):
//   Focal Length: 85mm
//   Aperture: f/1.8 (extreme bokeh)
//   Focus: Eyes of the character

// ── STEP 4: Animate Camera Movement ──────────────────
// For each camera, add Transform tracks in Sequencer:
//
// Dolly Move (push in):
//   Key frame 0: Camera 5m from subject
//   Key frame 120 (5 sec): Camera 2m from subject
//   Curve: Ease In-Out (smooth acceleration)
//
// Orbit/Arc:
//   Attach camera to a rotating arm (Blueprint)
//   Animate rotation from 0° → 45° over 3 seconds
//
// Crane Shot:
//   Animate SpringArm length: 200 → 600 cm
//   Animate pitch: 0° → -30° (looking down)
//
// Focus Pull (Rack Focus):
//   Key frame 0: Focus on foreground character
//   Key frame 48 (2 sec): Focus on background character
//   Curve: Linear (smooth, deliberate)

// ── STEP 5: Export Settings ───────────────────────────
// Sequencer → Render Movie (Clapper icon)
//
// Recommended Export Settings:
//   Resolution:       3840 × 2160 (4K)
//   Frame Rate:       24 fps (cinematic)
//   Output Format:    PNG Image Sequence (best quality)
//                     OR Apple ProRes 4444 (with alpha)
//   Anti-Aliasing:    Spatial: TSR, Temporal Samples: 8
//   Console Variable: r.MotionBlurQuality 4
//   Warm-Up Frames:   32 (lets Lumen GI stabilise)
//
// USE MOVIE RENDER QUEUE (not the basic movie export):
//   Window → Cinematics → Movie Render Queue
//   This gives: render passes, higher quality AA, EXR output

// ── CINEMATOGRAPHY RULES OF THUMB ────────────────────
// 1. 180° Rule: Keep camera on ONE side of the action
// 2. Rule of Thirds: Place subjects at grid intersections
// 3. Lead Room: Give characters space to "look into"
// 4. Cutting on Action: Cut DURING movement, not before/after
// 5. Shot Duration: Wide=5s+, Medium=3-5s, Close=1-3s
// 6. Every cut must be motivated — "why am I cutting here?"`,
      troubleshooting: [
        { error: 'Movie Render Queue produces black frames', cause: 'Lumen GI needs warm-up frames', fix: 'Set Warm-Up Frame Count to 32+ in MRQ settings to let Lumen converge' },
        { error: 'Depth of field not visible in render', cause: 'Post process volume not configured', fix: 'Ensure CineCamera has DOF enabled and there\'s a Post Process Volume with "Infinite Extent" checked' },
      ],
    },
  ],
  project: {
    title: 'Cinematic Short Film in Unreal Engine 5',
    description:
      'Create a 30-60 second cinematic short entirely in UE5. Use Megascans environments, Lumen lighting, Sequencer multi-camera editing, and post-processing to tell a visual story. No dialogue required — pure visual storytelling with cinematography and atmosphere.',
    code: {
      id: 'anim4-project',
      title: 'UE5 Cinematic Short — Production Checklist',
      language: 'markdown',
      code: `# ── DELIVERABLES ──────────────────────────────────────
# 1. Final render: 1920×1080 or 3840×2160, 24fps, H.264/ProRes
# 2. Project file (.uproject with all assets)
# 3. Breakdown reel showing individual elements
# 4. Shot list / storyboard document

# ── STORY REQUIREMENTS ────────────────────────────────
# Genre: Open (architectural, sci-fi, nature, horror, fantasy)
# Duration: 30-60 seconds (720-1440 frames)
# Shots: Minimum 4, Maximum 8
# Must include:
# □ At least ONE slow camera movement (dolly, crane, or orbit)
# □ At least ONE static composition shot (tripod feel)
# □ A focus pull (rack focus) moment
# □ Clear visual narrative arc (beginning → middle → end)
# □ NO dialogue — story told purely through visuals

# ── ENVIRONMENT ───────────────────────────────────────
# □ Megascans assets used for ground textures + props
# □ Nanite enabled on complex meshes
# □ Minimum 3 different material types visible
# □ Atmosphere/fog for depth (Exponential Height Fog)
# □ Decals for ground detail (puddles, cracks, debris)

# ── LIGHTING ──────────────────────────────────────────
# □ Lumen enabled (Global Illumination + Reflections)
# □ Directional Light configured as sun/moon
# □ Sky Light with Real Time Capture
# □ At least ONE practical light source (lamp, fire, neon)
# □ Clear lighting mood that supports the story
# □ Time of day chosen intentionally (golden hour, blue hour, night)

# ── CAMERAS (Sequencer) ──────────────────────────────
# □ Movie Render Queue used for final output
# □ CineCamera Actors with film-accurate settings
# □ Camera Cut track with shot transitions
# □ DOF (Depth of Field) with intentional focus
# □ 32+ warm-up frames for Lumen convergence
# □ Post-processing: color grade, bloom, vignette, grain

# ── AUDIO (Optional but Recommended) ─────────────────
# □ Ambient soundscape (wind, birds, city, rain)
# □ Music track (royalty-free from Artlist, Epidemic Sound)
# □ Sound design synced to key moments
# □ Audio track added in Sequencer or DaVinci Resolve

# ── GRADING RUBRIC ────────────────────────────────────
# Cinematography & Composition    30%
# Lighting & Atmosphere           25%
# Technical Quality (Nanite/Lumen) 20%
# Storytelling / Emotional Impact  15%
# Polish & Presentation           10%`,
      troubleshooting: [
        { error: 'Final render has flickering/shimmer', cause: 'Temporal instability in Lumen or TSR', fix: 'Increase Warm-Up Frames to 64, and set Temporal Sample Count to 16 in MRQ anti-aliasing' },
        { error: 'Exported video has washed-out colors', cause: 'Color space mismatch (sRGB vs Linear)', fix: 'Enable "Disable Tone Curve" in MRQ, or export as EXR and apply LUT in DaVinci Resolve' },
      ],
    },
  },
};

export const animationCourseModules: CourseModule[] = [animModule1, animModule2, animModule3, animModule4];
