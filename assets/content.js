// Set each photo's relative asset path here when the owner's photos are ready.
const portfolioPhotos={
 'artobot':'images/artobot.webp','rfid':'images/rfid-smart-toll-system.webp','equinox':'images/equinox-attire.jpg',
 'coxs-bazar-1':'images/travel/coxs-bazar-1.webp','coxs-bazar-2':'images/travel/coxs-bazar-2.webp','sylhet-1':'images/travel/sylhet-1.webp','sylhet-2':'images/travel/sylhet-2.webp',
 'sreemangal-1':'images/travel/sreemangal-1.webp','sreemangal-2':'images/travel/sreemangal-2.webp','chandpur-1':'images/travel/chandpur-1.webp','chandpur-2':'images/travel/chandpur-2.webp',
 'sonargaon-1':'images/travel/sonargaon-1.webp','sonargaon-2':'images/travel/sonargaon-2.webp','rajshahi-1':'images/travel/rajshahi-1.webp','rajshahi-2':'images/travel/rajshahi-2.webp',
 'khulna-1':'','khulna-2':'','cumilla-1':'','cumilla-2':''
};
document.querySelectorAll('[data-photo]').forEach(slot=>{
 const source=portfolioPhotos[slot.dataset.photo];if(!source)return;
 const image=new Image();image.alt=slot.getAttribute('aria-label');image.loading='lazy';
 image.addEventListener('load',()=>slot.append(image));image.src=source;
});

document.getElementById('contactForm').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
 const button=form.querySelector('button[type="submit"]'),status=document.getElementById('contactStatus');
 if(button.disabled)return;button.disabled=true;button.textContent='Sending…';status.textContent='';
 const data=new FormData(form);data.set('_subject','New Message from Hasibul Hasan Portfolio!');data.set('_captcha','false');data.set('_replyto',String(data.get('email')));
 try{
  const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
  const result=await response.json();
  if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Not accepted');
  form.reset();document.getElementById('sentDialog').showModal();
 }catch{
  status.textContent='Sending could not be confirmed. Please try again or email himelhasib2001@gmail.com.';
 }finally{button.disabled=false;button.textContent='Send'}
});
