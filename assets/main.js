(function(){
var WA='919811506015';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
requestAnimationFrame(function(){setTimeout(function(){document.body.classList.add('loaded')},60)});
var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();

/* Mobile menu + dropdowns */
var mb=document.getElementById('menuBtn'),nw=document.getElementById('navWrap');
if(mb)mb.addEventListener('click',function(){var o=nw.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'✕':'☰';document.body.style.overflow=o?'hidden':''});
document.querySelectorAll('.nav>li>button').forEach(function(b){
  b.addEventListener('click',function(e){var li=b.parentElement,o=li.classList.contains('open');
    document.querySelectorAll('.nav>li.open').forEach(function(x){x.classList.remove('open')});
    if(!o)li.classList.add('open');b.setAttribute('aria-expanded',!o);e.stopPropagation()});
});
document.addEventListener('click',function(e){if(!e.target.closest('.nav'))document.querySelectorAll('.nav>li.open').forEach(function(x){x.classList.remove('open')})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('.nav>li.open').forEach(function(x){x.classList.remove('open')})});

/* Progress + back to top */
var pr=document.getElementById('progress'),tt=document.getElementById('totop');
function sc(){var h=document.documentElement.scrollHeight-innerHeight;if(pr)pr.style.transform='scaleX('+(h>0?scrollY/h:0)+')';if(tt)tt.classList.toggle('show',scrollY>700)}
addEventListener('scroll',sc,{passive:true});sc();
if(tt)tt.addEventListener('click',function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

/* Reveal */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
  document.querySelectorAll('[data-reveal]').forEach(function(el){io.observe(el)});
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;cio.unobserve(e.target);
    var el=e.target,end=+el.dataset.count,t0=performance.now(),dur=reduce?0:1600;
    (function tick(t){var p=dur?Math.min(1,(t-t0)/dur):1;el.textContent=Math.round(end*(1-Math.pow(1-p,4)));if(p<1)requestAnimationFrame(tick)})(t0);
  })},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el)});
}else{document.querySelectorAll('[data-reveal]').forEach(function(el){el.classList.add('in')})}

/* Tilt + spotlight */
if(fine&&!reduce){
  document.querySelectorAll('.tilt').forEach(function(c){
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,yy=(e.clientY-r.top)/r.height;
      c.style.transform='rotateY('+((x-.5)*10)+'deg) rotateX('+((.5-yy)*10)+'deg)';c.style.setProperty('--mx',x*100+'%');c.style.setProperty('--my',yy*100+'%')});
    c.addEventListener('pointerleave',function(){c.style.transition='transform .6s cubic-bezier(.2,.8,.2,1)';c.style.transform='';setTimeout(function(){c.style.transition=''},600)});
  });
}

/* Forms -> WhatsApp */
document.querySelectorAll('form[data-wa]').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var err=f.querySelector('.err'),name=(f.name&&f.name.value||'').trim(),phone=(f.phone&&f.phone.value||'').replace(/\D/g,'');
    if(!name){err.textContent='Please enter your name.';f.name.focus();return}
    if(phone.length<10){err.textContent='Please enter a valid 10-digit phone number.';f.phone.focus();return}
    err.textContent='';
    var lines=['Hi Kiwtech Solution,','','Name: '+name,'Phone: '+phone];
    ['biz','city','svc','budget','msg'].forEach(function(k){if(f[k]&&f[k].value.trim())lines.push({biz:'Business',city:'City',svc:'Service',budget:'Monthly budget',msg:'Message'}[k]+': '+f[k].value.trim())});
    lines.push('','Page: '+document.title);
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
    f.reset();err.style.color='#1FBF84';err.textContent='WhatsApp opened. Just press send and we will reply soon.';
    setTimeout(function(){err.style.color='';err.textContent=''},8000);
  });
});
})();
