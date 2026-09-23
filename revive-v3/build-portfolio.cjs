const fs=require('node:fs'),path=require('node:path');
const {collections,photos,aliases={}}=JSON.parse(fs.readFileSync(path.join(__dirname,'portfolio.json'),'utf8'));
const root=__dirname;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const changed={};
// Preserve the current Typeform link when rebuilding galleries.
const vm=require('node:vm');
const existing={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),existing);
const inquiry=existing.window.REVIVE_CONTENT.typeformUrl;
if(typeof inquiry!=='string'||!inquiry.startsWith('https://'))throw new Error('Set a secure Typeform URL in content.js before rebuilding.');
(async()=>{
 const img=(p,sizes,priority=false)=>`<img src="${p.thumbnail}"${p.srcset?` srcset="${p.srcset}" sizes="${sizes}"`:''} alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" ${priority?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
 const photo=(slug,index,total,featured=false)=>{const p=photos[slug];return `<figure class="collection-photo${featured?' collection-feature':''}"><a class="photo-open" href="${p.image}" data-photo aria-label="${esc('View photo '+(index+1)+' of '+total+': '+p.alt)}">${img(p,featured?'(max-width: 760px) 88vw, 48vw':'(max-width: 600px) 88vw, (max-width: 1000px) 43vw, 28vw',featured)}<span class="photo-expand" aria-hidden="true">View larger ↗</span></a><figcaption>${String(index+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</figcaption></figure>`};
 const collage=(c,interactive=false)=>`<div class="photo-collage collage-${c.theme}${interactive?' collage-interactive':''}">${c.collage.map((spot,index)=>{
  const p=photos[spot.photo],tag=interactive?'a':'span';
  const style=`--x:${spot.x}%;--y:${spot.y}%;--w:${spot.w}%;--h:${spot.h}%;--layer:${spot.layer||1}`;
  return `<${tag} class="collage-photo${spot.cutout?' collage-cutout':''}" style="${style}"${interactive?` href="${p.image}" data-photo aria-label="View photograph: ${esc(p.alt)}"`:''}>${img(interactive?p:{...p,alt:''},interactive?'(max-width: 700px) 80vw, 35vw':'(max-width: 760px) 35vw, 20vw',interactive&&index<3)}</${tag}>`;
 }).join('')}</div>`;
 const config={typeformUrl:inquiry,portfolio:collections.map(c=>({...photos[c.cover],caption:c.title,theme:c.theme,collage:c.collage.map(spot=>({...spot,...photos[spot.photo]})),href:`work-${c.slug}.html`,count:c.items.length}))};
 changed['content.js']='/* Homepage collections + inquiry link. Full gallery pages are generated from portfolio.json. */\nwindow.REVIVE_CONTENT = '+JSON.stringify(config,null,2)+';\n';
 const cards=collections.map(c=>`        <a class="collection-link" href="work-${c.slug}.html" aria-label="Explore ${esc(c.title)}"><figure>${collage(c)}<figcaption><span>${esc(c.title)}</span><span class="collection-cue">Explore collection · ${c.items.length} photos <span aria-hidden="true">↗</span></span></figcaption></figure></a>`).join('\n');
 changed['index.html']=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/(<div class="gallery(?: collection-overview)?" id="portfolioGallery">)[\s\S]*?(\n      <\/div>)/,'<div class="gallery collection-overview" id="portfolioGallery">\n'+cards+'$2');
 for(const [index,c] of collections.entries()){
  const next=collections[(index+1)%collections.length],first=photos[c.items[0]];
  const remaining=c.items.filter(slug=>!c.collage.some(spot=>spot.photo===slug));
  const nav=collections.map(x=>`<a href="work-${x.slug}.html"${x.slug===c.slug?' aria-current="page"':''}>${esc(x.nav)}</a>`).join('');
  changed[`work-${c.slug}.html`]=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(c.title)} — Revive Creative Collective</title>
  <meta name="description" content="${esc(c.intro)} Explore ${esc(c.nav.toLowerCase())} photography by Eden at Revive Creative Collective.">
  <meta name="theme-color" content="#fff8ee">
  <link rel="canonical" href="https://revivecreativecollective.com/work-${c.slug}">
  <meta property="og:title" content="${esc(c.title)} — Revive Creative Collective"><meta property="og:type" content="website"><meta property="og:description" content="${esc(c.intro)}"><meta property="og:image" content="https://revivecreativecollective.com/${first.image}">
  <link rel="icon" href="assets/brand/revive-r-blue.png">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v=collage-20260918"><link rel="stylesheet" href="portfolio.css?v=collage-20260918"><link rel="stylesheet" href="collage.css?v=collage-20260918">
  <script src="content.js?v=collage-20260918" defer></script><script src="script.js?v=collage-20260918" defer></script><script src="portfolio.js?v=collage-20260918" defer></script>
</head>
<body class="collection-page collage-page">
  <a class="skip-link" href="#collection">Skip to photographs</a>
  <header class="site-header"><a class="wordmark" href="index.html" aria-label="Revive home">REVIVE<span>Creative Collective</span></a><div class="header-actions"><a class="back-link" href="index.html#work">← All collections</a><a class="header-inquire" data-inquiry-link href="${inquiry}">Inquire <span aria-hidden="true">↗</span></a></div></header>
  <main id="collection">
    <section class="collage-heading" aria-labelledby="collectionTitle"><div><p class="kicker">The collections / ${String(index+1).padStart(2,'0')}</p><h1 id="collectionTitle">${esc(c.title)}</h1></div><p class="collection-description">${esc(c.intro)}<span>${c.items.length} photographs · By Eden</span></p></section>
    <nav class="collection-nav collection-nav-top" aria-label="Portfolio collections">${nav}</nav>
    <section class="collage-board" aria-label="${esc(c.title)} photo collage">${collage(c,true)}</section>
    ${remaining.length?`<section class="collection-body" id="photographs" aria-label="More ${esc(c.nav.toLowerCase())} photographs"><p class="kicker more-photos-label">A little more to explore</p><div class="collection-grid">
      ${remaining.map(slug=>photo(slug,c.items.indexOf(slug),c.items.length)).join('\n      ')}
    </div></section>`:''}
    <section class="collection-end" aria-labelledby="moreTitle"><p class="kicker">Keep exploring</p><h2 id="moreTitle">${esc(next.title)}</h2><a class="pill" href="work-${next.slug}.html">Next collection <span aria-hidden="true">↗</span></a></section>
    <section class="collection-inquire"><h2>Let’s curate <em>your world.</em></h2><a class="pill solid" data-inquiry-link href="${inquiry}">Start something <span aria-hidden="true">↗</span></a></section>
  </main>
  <footer><a class="footer-brand" href="index.html">REVIVE</a><span>A breath of fresh air.</span><a href="mailto:eden@revivecreativecollective.com">eden@revivecreativecollective.com</a></footer>
  <dialog class="photo-dialog" id="photoDialog" aria-label="Photograph viewer"><div class="photo-toolbar"><p id="photoPosition" aria-live="polite"></p><button class="photo-close" type="button" aria-label="Close photograph viewer">Close ×</button></div><div class="photo-stage"><button class="photo-prev" type="button" aria-label="Previous photograph">←</button><img id="photoFull" alt=""><button class="photo-next" type="button" aria-label="Next photograph">→</button></div><p id="photoCaption"></p></dialog>
</body>
</html>
`;
 }
 for(const [oldSlug,newSlug] of Object.entries(aliases)){
  const title=collections.find(c=>c.slug===newSlug).title;
  changed[`work-${oldSlug}.html`]=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=work-${newSlug}.html"><link rel="canonical" href="https://revivecreativecollective.com/work-${newSlug}"><title>${esc(title)} — Revive Creative Collective</title></head><body><p>This collection has a new home: <a href="work-${newSlug}.html">${esc(title)}</a>.</p></body></html>\n`;
 }
 for(const [file,content] of Object.entries(changed)) fs.writeFileSync(path.join(root,file),content);
 console.log(`Updated ${collections.length} galleries, homepage links and content.js.`);
})().catch(e=>{console.error(e);process.exit(1)});
