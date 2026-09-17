const fs=require('node:fs'),path=require('node:path');
const {collections,photos}=JSON.parse(fs.readFileSync(path.join(__dirname,'portfolio.json'),'utf8'));
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
 const config={typeformUrl:inquiry,portfolio:collections.map(c=>({...photos[c.cover],caption:c.title,layout:c.layout,href:`work-${c.slug}.html`,count:c.items.length}))};
 changed['content.js']='/* Homepage collections + inquiry link. Full gallery pages are generated from portfolio.json. */\nwindow.REVIVE_CONTENT = '+JSON.stringify(config,null,2)+';\n';
 changed['portfolio.json']=JSON.stringify({photos,collections},null,2)+'\n';
 const cards=config.portfolio.map(c=>`        <figure${c.layout?` class="${c.layout}"`:''}><a class="collection-link" href="${c.href}">${img(c,'(max-width: 760px) 85vw, 50vw')}<figcaption><span>${esc(c.caption)}</span><span class="collection-cue">View collection · ${c.count} photos <span aria-hidden="true">↗</span></span></figcaption></a></figure>`).join('\n');
 changed['index.html']=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/(<div class="gallery" id="portfolioGallery">)[\s\S]*?(\n      <\/div>)/,'$1\n'+cards+'$2');
 for(const [index,c] of collections.entries()){
  const next=collections[(index+1)%collections.length],first=photos[c.items[0]];
  const nav=collections.map(x=>`<a href="work-${x.slug}.html"${x.slug===c.slug?' aria-current="page"':''}>${esc(x.nav)}</a>`).join('');
  changed[`work-${c.slug}.html`]=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(c.title)} — Revive Creative Collective</title>
  <meta name="description" content="${esc(c.intro)} Explore ${esc(c.nav.toLowerCase())} photography by Eden at Revive Creative Collective.">
  <meta name="theme-color" content="#152837">
  <link rel="canonical" href="https://revivecreativecollective.com/work-${c.slug}">
  <meta property="og:title" content="${esc(c.title)} — Revive Creative Collective"><meta property="og:type" content="website"><meta property="og:description" content="${esc(c.intro)}"><meta property="og:image" content="https://revivecreativecollective.com/${first.image}">
  <link rel="icon" href="assets/brand/revive-r-blue.png">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v=portfolio-20260916"><link rel="stylesheet" href="portfolio.css?v=portfolio-20260916">
  <script src="content.js?v=portfolio-20260916" defer></script><script src="script.js?v=portfolio-20260916" defer></script><script src="portfolio.js?v=portfolio-20260916" defer></script>
</head>
<body class="collection-page">
  <a class="skip-link" href="#collection">Skip to photographs</a>
  <header class="site-header"><a class="wordmark" href="index.html" aria-label="Revive home">REVIVE<span>Creative Collective</span></a><div class="header-actions"><a class="back-link" href="index.html#work">← All collections</a><a class="header-inquire" data-inquiry-link href="${inquiry}">Inquire <span aria-hidden="true">↗</span></a></div></header>
  <main id="collection">
    <section class="collection-intro" aria-labelledby="collectionTitle">
      <div class="collection-copy"><p class="kicker">The collections / ${String(index+1).padStart(2,'0')}</p><h1 id="collectionTitle">${esc(c.title)}</h1><p class="collection-description">${esc(c.intro)}</p><p class="collection-count">${c.items.length} photographs · By Eden</p><a class="text-link" href="#photographs">Take a look around <span aria-hidden="true">↓</span></a></div>
      ${photo(c.items[0],0,c.items.length,true)}
    </section>
    <section class="collection-body" id="photographs" aria-label="More ${esc(c.nav.toLowerCase())} photographs"><div class="collection-grid">
      ${c.items.slice(1).map((slug,i)=>photo(slug,i+1,c.items.length)).join('\n      ')}
    </div></section>
    <section class="collection-end" aria-labelledby="moreTitle"><p class="kicker">A little more to explore</p><h2 id="moreTitle">${esc(next.title)}</h2><a class="pill" href="work-${next.slug}.html">Next collection <span aria-hidden="true">↗</span></a><nav class="collection-nav" aria-label="Portfolio collections">${nav}</nav></section>
    <section class="collection-inquire"><h2>Let’s curate <em>your world.</em></h2><a class="pill solid" data-inquiry-link href="${inquiry}">Start something <span aria-hidden="true">↗</span></a></section>
  </main>
  <footer><a class="footer-brand" href="index.html">REVIVE</a><span>A breath of fresh air.</span><a href="mailto:eden@revivecreativecollective.com">eden@revivecreativecollective.com</a></footer>
  <dialog class="photo-dialog" id="photoDialog" aria-label="Photograph viewer"><div class="photo-toolbar"><p id="photoPosition" aria-live="polite"></p><button class="photo-close" type="button" aria-label="Close photograph viewer">Close ×</button></div><div class="photo-stage"><button class="photo-prev" type="button" aria-label="Previous photograph">←</button><img id="photoFull" alt=""><button class="photo-next" type="button" aria-label="Next photograph">→</button></div><p id="photoCaption"></p></dialog>
</body>
</html>
`;
 }
 for(const [file,content] of Object.entries(changed)) fs.writeFileSync(path.join(root,file),content);
 console.log(`Updated ${collections.length} galleries, homepage links and content.js.`);
})().catch(e=>{console.error(e);process.exit(1)});
