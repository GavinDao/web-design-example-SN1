# Jack — 3D Creator Replica

A React + TypeScript recreation based on the supplied design specification.

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Notes

The implementation uses the remote image/GIF URLs supplied in the design spec.
If any third-party source blocks hotlinking or removes an asset, download that asset
locally and replace the corresponding URL in `src/App.tsx`.
