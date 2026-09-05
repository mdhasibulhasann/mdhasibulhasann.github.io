const resumeDialog=document.getElementById('resumeDialog');
document.getElementById('viewResume').addEventListener('click',()=>resumeDialog.showModal());
const bottomDock=document.getElementById('mobile');
let dockTimer;
window.addEventListener('scroll',()=>{
 if(window.innerWidth>620)return;
 bottomDock.classList.add('scroll-hidden');
 clearTimeout(dockTimer);
 dockTimer=setTimeout(()=>bottomDock.classList.remove('scroll-hidden'),220);
},{passive:true});
window.addEventListener('resize',()=>{if(window.innerWidth>620)bottomDock.classList.remove('scroll-hidden')});
