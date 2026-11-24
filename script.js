// Yanina Benítez · Disco Night · JavaScript de la invitación
// La fecha incluye el horario de Paraguay (UTC -03:00).
const EVENT_DATE = new Date('2026-12-19T20:30:00-03:00');
const $ = id => document.getElementById(id);
const audio = $('bgMusic');
const musicBtn = $('musicButton');
const musicLabel = $('musicLabel');
let musicMissing = false;

function updateCountdown(){
  const remaining=Math.max(0,EVENT_DATE.getTime()-Date.now());
  const sec=Math.floor(remaining/1000);
  const vals={days:Math.floor(sec/86400),hours:Math.floor(sec%86400/3600),minutes:Math.floor(sec%3600/60),seconds:sec%60};
  for(const [id,n] of Object.entries(vals)) $(id).textContent=String(n).padStart(2,'0');
  if(remaining===0) $('countdownMsg').textContent='¡LLEGÓ EL GRAN DÍA! ✦';
}
updateCountdown();
setInterval(updateCountdown,1000);

$('openInvite').addEventListener('click',()=>{
  document.body.classList.add('opened');
  $('entry').setAttribute('aria-hidden','true');
  $('openInvite').blur();
  window.scrollTo({top:0,behavior:'instant'});
});

function syncMusicUI(){
  const playing=!audio.paused;
  musicBtn.classList.toggle('playing',playing);
  musicLabel.textContent=playing?'PAUSAR':'MÚSICA';
  musicBtn.setAttribute('aria-label',playing?'Pausar música':'Reproducir música');
}
musicBtn.addEventListener('click',async()=>{
  if(!audio.paused){audio.pause();syncMusicUI();return;}
  if(musicMissing){alert('Para activar la música, guardá un archivo MP3 autorizado como musica/iris.mp3.');return;}
  try{await audio.play();syncMusicUI();}catch(e){syncMusicUI();alert('La música aún no está disponible. Colocá un MP3 autorizado llamado iris.mp3 dentro de la carpeta musica.');}
});
audio.addEventListener('error',()=>{musicMissing=true;syncMusicUI();});
audio.addEventListener('pause',syncMusicUI);
audio.addEventListener('play',syncMusicUI);

// Animaciones de aparición: si el navegador no admite IntersectionObserver, mostrar igual.
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(items=>items.forEach(item=>{
    if(item.isIntersecting){item.target.classList.add('visible');observer.unobserve(item.target);}
  }),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

// Destellos ligeros; no afectan los botones ni las fotografías.
const stars=$('sparkleLayer');
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  for(let i=0;i<28;i++){
    const dot=document.createElement('span');dot.className='sparkle-dot';dot.textContent=i%3===0?'✧':'✦';
    dot.style.left=((i*79+11)%100)+'%';dot.style.top=((i*43+17)%100)+'%';
    dot.style.setProperty('--time',(4+i%5)+'s');dot.style.setProperty('--delay',(-i*.41)+'s');
    dot.style.fontSize=(8+(i*7)%10)+'px';stars.appendChild(dot);
  }
}

// Galería ampliable con flechas y Escape. Fotos locales, sin librerías externas.
const lightbox=$('lightbox'),lightImg=$('lightboxImage'),lightCounter=$('lightboxCounter');
const photos=Array.from(document.querySelectorAll('#photoGrid .gallery-photo img'));
let active=0;
function displayPhoto(i){active=(i+photos.length)%photos.length;lightImg.src=photos[active].src;lightImg.alt=photos[active].alt;lightCounter.textContent=`${active+1} / ${photos.length}`;}
photos.forEach((photo,i)=>photo.closest('button').addEventListener('click',()=>{
  displayPhoto(i);
  if(typeof lightbox.showModal==='function') lightbox.showModal();
}));
$('closeLightbox').addEventListener('click',()=>lightbox.close());
$('prevPhoto').addEventListener('click',()=>displayPhoto(active-1));
$('nextPhoto').addEventListener('click',()=>displayPhoto(active+1));
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
document.addEventListener('keydown',e=>{
  if(!lightbox.open)return;
  if(e.key==='ArrowRight')displayPhoto(active+1);
  if(e.key==='ArrowLeft')displayPhoto(active-1);
});
