# Revive V3 — nature revision

## Current site — September 16, 2026 (Phoenix)

Production: https://revivecreativecollective.com/ (also www). GitHub `main/revive-v3` is the source of truth and auto-deploys to the existing `revive-v3` Worker. No new site, V4 folder, or DNS changes are needed for portfolio updates.

The portfolio now has six full-page collections: Style + details, Food + drink, Community, Places + travel, After dark, and Portraits. The September portfolio ZIP supplied 46 files: 45 unique photographs plus one duplicate (`jonb1.JPG` matches `jonb.JPG`). All 45 unique photographs are included. `champagnelanes.JPG` is the After Dark homepage cover and first image. Some photographs appear in more than one relevant collection.

New photographs have 640px and 1800px long-edge WebP copies (without upscaling); responsive image selection, lazy loading, descriptive alternative text, and a keyboard-accessible full-screen viewer are included. Original files are unchanged. Metadata is not copied into the WebP exports. The previously approved About copy, portrait, Typeform, and atmospheric animation are preserved.

## Historical release record — September 9, 2026 (superseded)

Live site: https://revive-v3.ed6schu.workers.dev/

Cloudflare version: `4c5c9f1f-d5db-4537-ba30-93c165083bf6`; production deployment: `b086e246-b184-49c2-8603-718c4238a195` at 100% traffic. Previous version retained for rollback: `a87aeafa-aa82-4ad7-be57-37fe1917dbbf`.

That September 9 direct release initially required a GitHub sync. GitHub has since been synced, the custom domains attached, and Git auto-deployment configured. The version IDs in this historical section are not the current release.

Verification: 21 published files checked byte-for-byte, portfolio asset paths and HTML links checked, 404 and content cache headers checked. Desktop and 390px browser previews reviewed; cloud/water canvases load with static fallbacks and pause controls. This is not a physical-iPhone device test.

This folder is the complete new site. No framework, package install or build command is required. Earlier files and original full-resolution photographs have been preserved outside this release folder.

## Preview

Open `index.html` in a browser, or serve this folder with `python3 -m http.server 4173`. A local web server enables the enhanced water animation; opening files directly may use the still-image fallback.

## Update without a redesign

### Typeform

Current Typeform: https://form.typeform.com/to/akWqAavH. Inquiry buttons open it directly, and the old inquiry page forwards visitors to it when JavaScript is available. A direct form link and business email remain as fallbacks. The About Me paragraphs were updated to Eden’s supplied copy on September 15, 2026.

To change the form link later, open `content-editor.html` locally, paste the new published link, download `content.js`, and replace that file in GitHub’s `revive-v3` folder. Also update the static Typeform links in `index.html` and `inquiry.html` so visitors without JavaScript receive the same link. The site does not store questionnaire submissions; Typeform handles them.

Once connected, edit questions inside the SAME Typeform and click **Publish edits** there. Your site needs no update as long as that form's URL stays the same. Changing question types or deleting questions may affect existing Typeform results; export them first when needed.

### Portfolio

The simplest workflow for Eden is to supply a photo folder or ZIP and name any required placements. Adding images remains a content update to the existing website.

For code-based updates:

1. Keep original photographs safely outside the deploy folder. Create web-ready copies and place them in `assets/web`.
2. Add their paths, descriptive alt text, dimensions, and optional responsive `srcset` to `photos` in `portfolio.json`.
3. Add each photo's key to the appropriate collection's ordered `items` list. A photo may appear in multiple collections. The `cover` key selects the homepage image.
4. Run `node build-portfolio.cjs` locally from this folder. It refreshes six standalone HTML pages, homepage fallback cards, counts, and `content.js`. No package installation is required. This generator is excluded from public assets; the Cloudflare build command stays blank because generated pages are committed.
5. Preview locally and upload the changed files and optimized images to the existing `revive-v3` folder on GitHub. Committing to `main` triggers the same site's deployment.

The local content helper edits homepage covers and the Typeform link; it preserves collection links and responsive metadata but does not edit full gallery contents. Use `portfolio.json` and the generator for collection changes. The photographs and links remain browseable without JavaScript; JavaScript adds the full-screen viewer.

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

The existing Worker address is `https://revive-v3.ed6schu.workers.dev`. Both `revivecreativecollective.com` and `www.revivecreativecollective.com` are attached. A direct Cloudflare release does not automatically update GitHub; normal content updates should go through GitHub.

## Included

- Approved wording and new Eden portrait.
- Photographic cloud sky, independently drifting organic cloud layers, a shooting star every 30 seconds.
- Animated blue water and Eden’s Arizona desert closing photograph with subtly drifting cloud bands; mountains, plants and text remain still.
- Inquiry buttons open the published Typeform; old inquiry-page links forward there with an email fallback.
- Motion pause control (remembered on the device), reduced-motion support, off-screen water rendering pause, keyboard-accessible menu and accordion, static image fallbacks.
- `portfolio.json` holds collection data; `build-portfolio.cjs` generates static gallery pages and homepage cards. `content.js` holds runtime homepage cards and the Typeform URL.
- Existing photos have smaller WebP copies; no AI client work or testimonials were added.

No newsletter, analytics tracker, payment or booking system has been activated. Inquiry links use Eden’s published Typeform; the supplied business email remains available in the footer.

## Sources

- Cloudflare static asset setup: https://developers.cloudflare.com/workers/static-assets/binding/
- Typeform publishing existing edits: https://help.typeform.com/hc/en-us/articles/360052109711-Edit-your-form-in-preview-mode
