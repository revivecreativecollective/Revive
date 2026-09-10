# Revive V3 — nature revision

## Release record — September 9, 2026 (Phoenix)

Live site: https://revive-v3.ed6schu.workers.dev/

Cloudflare version: `4c5c9f1f-d5db-4537-ba30-93c165083bf6`; production deployment: `b086e246-b184-49c2-8603-718c4238a195` at 100% traffic. Previous version retained for rollback: `a87aeafa-aa82-4ad7-be57-37fe1917dbbf`.

GitHub has NOT been updated by this release. Before triggering another Git-based deployment, copy this package into `revive-v3` and confirm the build root described below. Custom-domain and email DNS records were not changed.

Verification: 21 published files checked byte-for-byte, portfolio asset paths and HTML links checked, 404 and content cache headers checked. Desktop and 390px browser previews reviewed; cloud/water canvases load with static fallbacks and pause controls. This is not a physical-iPhone device test.

This folder is the complete new site. No framework, package install or build command is required. Earlier files and original full-resolution photographs have been preserved outside this release folder.

## Preview

Open `index.html` in a browser, or serve this folder with `python3 -m http.server 4173`. A local web server enables the enhanced water animation; opening files directly may use the still-image fallback.

## Update without a redesign

### Typeform

Open `content-editor.html` locally and paste your published Typeform link. Click **Download content.js** and replace `content.js` in the GitHub `revive-v3` folder. The inquiry page's button will open your form. Until a valid link is present it opens an email to `eden@revivecreativecollective.com`; it does not claim to collect or save submissions.

Once connected, edit questions inside the SAME Typeform and click **Publish edits** there. Your site needs no update as long as that form's URL stays the same. Changing question types or deleting questions may affect existing Typeform results; export them first when needed.

### Portfolio

1. Keep original photographs safely on your computer. Export new website copies ideally around 1400–1800 pixels on the long edge and under 1 MB. JPG/JPEG/PNG/WebP work.
2. Upload them to GitHub → Revive → `revive-v3/assets/portfolio-photos`.
3. Open the included local `content-editor.html`, click **Add a photo**, and type its exact path, description, caption, and shape. For example: `assets/portfolio-photos/my-photo.jpg`. Capitalization matters.
4. Download `content.js` and replace the existing file in `revive-v3`.
5. Redeploy the existing Cloudflare site. This is a content update, not a new V4 folder or redesign. If Git auto-deploy is correctly configured, the commit triggers it.

The content helper is local-only and excluded from Wrangler uploads. It does not upload photos, edit GitHub, save changes automatically, or act as an online admin system. Open the latest downloaded copy of the site before editing so the helper loads the latest content.

## Cloudflare Workers / GitHub setup

Upload this folder's CONTENTS into the existing GitHub `revive-v3` folder. Do not nest another `revive-v3-next` inside it. Keep the original portfolio photographs already in GitHub; these files do not overwrite or remove them.

- Existing Worker/project name: `revive-v3`
- Production branch: `main`
- Root directory: `revive-v3`
- Build command: leave blank
- Deploy command: `npx wrangler deploy`
- Wrangler file: the included `wrangler.jsonc`
- Do not change DNS/MX/email forwarding records for this upload.

Previous GitHub files were split between `revive-v3-upload` (HTML/CSS) and `revive-v3` (photos). This package is self-contained and should be kept together in `revive-v3`.

The existing Worker address is `https://revive-v3.ed6schu.workers.dev`. Attaching `revivecreativecollective.com` is a separate deployment setting and was not assumed by this build. A direct Cloudflare release does not automatically update GitHub; keep the Git repository in sync before triggering another Git build.

## Included

- Approved wording and new Eden portrait.
- Photographic cloud sky, independently drifting organic cloud layers, a shooting star every 30 seconds.
- Animated blue water and Eden’s Arizona desert closing photograph with subtly drifting cloud bands; mountains, plants and text remain still.
- A conversation sky transitioning from sunset to night over about 90 seconds, holding and returning gently.
- Motion pause control (remembered on the device), reduced-motion support, off-screen water rendering pause, keyboard-accessible menu and accordion, static image fallbacks.
- `content.js` is the single editable source for Typeform and the portfolio. The HTML gallery is also present as a no-JavaScript fallback; if you want new photos reflected in that fallback, ask for the fallback markup to be refreshed too.
- Existing photos have smaller WebP copies; no AI client work or testimonials were added.

No newsletter, Typeform account, analytics tracker, payment or booking system has been activated. Inquiry uses the supplied business email until Typeform is configured.

## Sources

- Cloudflare static asset setup: https://developers.cloudflare.com/workers/static-assets/binding/
- Typeform publishing existing edits: https://help.typeform.com/hc/en-us/articles/360052109711-Edit-your-form-in-preview-mode
