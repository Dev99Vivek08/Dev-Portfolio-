# DEV.OS — Futuristic Developer Portfolio

## Overview
A premium, cinematic developer portfolio built with a cyberpunk/futuristic OS aesthetic. Features immersive 3D interactions, a real interactive terminal, hidden admin panel, and smooth motion design throughout.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion + GSAP
- **3D**: React Three Fiber + Three.js + Drei
- **Backend**: Supabase (auth + data)
- **Language**: TypeScript

## Color Palette
- Background: `#050505` (deep black)
- Primary Text: `#ffffff`
- Accent Neon: `#D9FF00` (lime)
- Secondary Gray: `#9CA3AF`

## Project Structure
```
portfolio/
├── app/
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Main page (all sections)
│   └── globals.css        # Global styles, animations
├── components/
│   ├── Loader.tsx         # Cinematic boot screen
│   ├── Cursor.tsx         # Custom neon cursor
│   ├── Navbar.tsx         # Fixed navigation
│   ├── Hero.tsx           # Fullscreen hero with 3D
│   ├── ParticleField.tsx  # React Three Fiber particles
│   ├── About.tsx          # Timeline + stats
│   ├── Projects.tsx       # Filterable project cards
│   ├── Skills.tsx         # Icon-based skill grid
│   ├── Terminal.tsx       # Interactive hacker terminal
│   ├── Contact.tsx        # Glassmorphism contact form
│   ├── MatrixRain.tsx     # Fullscreen matrix effect
│   ├── GlitchOverlay.tsx  # RGB glitch effect
│   ├── AdminPanel.tsx     # Hidden admin dashboard
│   └── Footer.tsx         # Footer
├── lib/
│   ├── data.ts            # Default portfolio data
│   └── supabase.ts        # Supabase client
└── public/
    └── avatar.png         # Replace with your photo
```

## Terminal Commands
### Public Commands
- `help` — Show command list
- `about` — Display bio
- `projects` — List projects
- `skills` — Show tech stack
- `contact` — Contact info
- `clear` — Clear output
- `theme matrix` — Activate matrix mode
- `theme lime` — Reset theme
- `music on/off` — Toggle ambient music

### Hidden Commands (Secret)
- `glitch.dev` — Trigger RGB glitch effect
- `root.dev` — Access denied joke
- `awaken.system` — Open hidden admin panel

## Admin Panel
Access: Type `awaken.system` in the terminal.
- Default demo password: `9950`
- For production: Use Supabase credentials

## Customization
1. Edit `lib/data.ts` to update all portfolio content
2. Replace `public/avatar.png` with your photo
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in environment secrets for production Supabase integration

## User Preferences
- Minimal, premium design — avoid overcrowding
- Lime (`#D9FF00`) for accent only — no rainbow gradients
- Mobile-first responsive architecture
- No fake skill percentage bars
