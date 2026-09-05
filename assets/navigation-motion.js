document.querySelectorAll('.nav-shell nav,#mobile').forEach(nav=>{
 const marker=document.createElement('span');marker.className='nav-highlight';marker.setAttribute('aria-hidden','true');nav.append(marker);
 function move(){
  const selected=nav.querySelector('a.active');
  if(!selected||!nav.getClientRects().length){marker.style.opacity='0';return}
  marker.style.width=selected.offsetWidth+'px';marker.style.height=selected.offsetHeight+'px';
  marker.style.transform='translate('+selected.offsetLeft+'px,'+selected.offsetTop+'px)';marker.style.opacity='1';
 }
 const watcher=new MutationObserver(move);nav.querySelectorAll('a').forEach(a=>watcher.observe(a,{attributes:true,attributeFilter:['class']}));
 new ResizeObserver(move).observe(nav);document.fonts.ready.then(move);move();
});
