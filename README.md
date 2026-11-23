# IM/OS | IMDEV Portfolio

A Windows-inspired, interactive portfolio by **Ibrahim Montaser**, Front-End & Mobile Developer and creator of **IMDEV**. Explore projects, skills, experience, and contact details through a desktop-style interface instead of a traditional scrolling page.

**[Open the live portfolio](https://im-portfolio-one.vercel.app/)**

## Preview

### Desktop
![IM/OS desktop with application icons and a centered taskbar](https://github.com/user-attachments/assets/948c99ea-b830-4a3e-ab87-bedd76d64b8f)

### Project explorer
![Project explorer with search, technology filters, and project cards](https://github.com/user-attachments/assets/0ea968e7-913d-4a6e-9703-3f1e74381381)

## Experience

- A desktop shell with application windows, a taskbar, and a Start Menu.
- Dedicated apps for projects, skills, experience, resume, and contact details.
- A searchable project explorer with technology filters.
- Animated UI transitions powered by Framer Motion.
- A mobile launcher for smaller screens.
- Keyboard shortcuts for search and window controls.

Double-click a desktop icon or use the taskbar to open an app. Try **Ctrl + K** to open search, or **Esc** to dismiss menus and search. Some operating systems may intercept window-management shortcuts before they reach the browser.

## Built with

| Area | Technology |
| --- | --- |
| UI | React + TypeScript |
| Build tooling | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Linting | Oxlint |

## Run locally

Use a Node.js release compatible with the Vite version in `package.json`.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

```bash
npm run build    # Type-check and create the production build
npm run preview  # Preview the production build locally
npm run lint     # Run Oxlint
```

## Project structure

```text
src/
  components/   Desktop, windows, taskbar, menus, and app UI
  context/      Desktop state and shared context
  data/         Profile and project content
  hooks/        Keyboard shortcuts and reusable behavior
public/         Images, icons, project media, and resume assets
```

## Personalization

Profile information lives in `src/data/profile.ts`, and project entries live in `src/data/projects.ts`. Images and downloadable assets are served from `public/`.

---

Built by **Ibrahim Montaser / IMDEV**.
