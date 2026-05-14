# AImages

A personal AI image gallery for `aimages.balmanrawat.com.np`.

Built with Astro, React, and Tailwind CSS. The gallery renders optimized images from `src/assets`, opens them in a lightbox, and supports captions, details, and downloads.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Content

- Add images to `src/assets`.
- Edit captions and details in `src/data/gallery.ts`.
- Site metadata is configured in `src/pages/index.astro` and `astro.config.mjs`.

## Deployment

The GitHub Pages workflow builds the static Astro site and deploys the `dist` directory.

## License

MIT License. See [LICENSE](./LICENSE).
