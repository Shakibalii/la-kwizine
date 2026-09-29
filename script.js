/* ---- Edit these to update the site ---- */
const CONFIG={
  whatsapp:'23057894088',
  phone:'+230 5789 4088',
  mapUrl:'https://maps.app.goo.gl/RVJeiCinNRymQTDP9',
  // Opening hours in minutes from midnight, Mauritius time. null = closed. Index 0 = Sunday.
  hours:[[420,840],null,[540,840],[540,840],[540,840],[540,840],[540,900]]
};
const FR='Fried rice & noodles',BN='Boiled noodles',BR='Bol renversé',AO='Add-ons',RN=['Rice','Noodles'];
const m=(id,cat,name,en,price,tags=[],o={})=>({id,cat,name,en,price,tags,...o});
const MENU=[
 m(1,FR,'Veg','Vegetables',125,['veg']),
 m(2,FR,'Poulet','Chicken',170,['chicken']),
 m(3,FR,'Poulet & oeuf','Chicken & egg',190,['chicken']),
 m(4,FR,'Poulet, oeuf & crevette','Chicken, egg & prawn',215,['chicken','seafood'],{special:1}),
 m(5,FR,'Agneau','Lamb',180,['lamb']),
 m(6,FR,'Agneau & oeuf','Lamb & egg',200,['lamb']),
 m(7,FR,'Agneau, oeuf & crevette','Lamb, egg & prawn',225,['lamb','seafood'],{special:1}),
 m(8,FR,'Riz frite poisson salé','Salted fish fried rice',150,['seafood']),
 m(9,FR,'Riz frite poisson salé & crevette','Salted fish & prawn fried rice',175,['seafood'],{special:1}),
 m(10,BN,'Saumon','Salmon',100,['seafood']),
 m(11,BN,'Agneau','Lamb',170,['lamb']),
 m(12,BN,'Poulet','Chicken',150,['chicken']),
 m(13,BN,'Salmi agneau','Lamb stew',180,['lamb']),
 m(14,BN,'Salmi ourite (poulpe)','Octopus stew',180,['seafood']),
 m(15,BR,'Veg','Vegetables',150,['veg']),
 m(16,BR,'Poulet & oeuf','Chicken & egg',200,['chicken']),
 m(17,BR,'Agneau & oeuf','Lamb & egg',225,['lamb']),
 m(18,BR,'Poulet, oeuf & crevette','Chicken, egg & prawn',225,['chicken','seafood'],{special:1}),
 m(19,BR,'Agneau, oeuf & crevette','Lamb, egg & prawn',240,['lamb','seafood'],{special:1}),
 m(20,AO,'Supplément','Extra egg, sao mai and more',20)
];
const SHORT={[FR]:'riz & mine frite',[BN]:'boiled noodles',[BR]:'bol renversé'};
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const $=s=>document.querySelector(s);
const rs=n=>'Rs '+n.toLocaleString('en-US');
const fmt=t=>{const h=Math.floor(t/60),mm=String(t%60).padStart(2,'0');return (h%12||12)+':'+mm+(h<12?' am':' pm')};
const cats=['All',...new Set(MENU.map(d=>d.cat))];
let cat='All',cart={},sel={};

function mauNow(){const t=new Date(Date.now()+4*3600e3);return{day:t.getUTCDay(),mins:t.getUTCHours()*60+t.getUTCMinutes()}}
function status(){
  const {day,mins}=mauNow(),h=CONFIG.hours[day],b=$('#badge');
  const open=h&&mins>=h[0]&&mins<h[1];
  b.classList.toggle('open',!!open);
  b.querySelector('span').textContent=open?'Open now · until '+fmt(h[1]):(h&&mins<h[0]?'Closed · opens today at '+fmt(h[0]):(h?'Closed for today':'Closed on '+DAYS[day]+'s'));
}
function renderTabs(){
  $('#tabs').innerHTML=cats.map(c=>'<button class="tab" aria-pressed="'+(c===cat)+'" data-c="'+c+'">'+c+'</button>').join('');
}
function renderMenu(){
  const p=$('#prot').value;
  const list=MENU.filter(d=>(cat==='All'||d.cat===cat)&&(!p||d.tags.includes(p)));
  $('#menuList').innerHTML=list.length?list.map(d=>{
    const b=d.base?(sel[d.id]||d.base[0]):'';
    return '<article class="dish"><div><h3>'+d.name+'</h3></div><div class="price">'+rs(d.price)+'</div><p>'+d.en+'</p><div class="act"><button class="add" data-id="'+d.id+'" aria-label="Add '+d.en+'">Add</button></div><div class="meta">'
    +(d.base?'<span class="seg" role="group" aria-label="Rice or noodles">'+d.base.map(x=>'<button data-s="'+d.id+':'+x+'" aria-pressed="'+(x===b)+'">'+x+'</button>').join('')+'</span>':'<span>'+d.cat+'</span>')
    +(d.special?'<span>Special</span>':'')+(d.tags.includes('veg')?'<span>Vegetarian</span>':'')+'</div></article>';
  }).join(''):'<p class="empty">No dishes match this filter. Choose “everything” to see the full menu.</p>';
}
function cartLines(){return Object.entries(cart).map(([k,q])=>{
  const [id,b]=k.split(':'),d=MENU.find(x=>x.id==id);
  const suf=SHORT[d.cat]&&!/fried rice/.test(d.en)?SHORT[d.cat]:'';
  return{k,d,q,label:d.en+(suf?' — '+suf:'')};
})}
function renderCart(){
  const L=cartLines(),n=L.reduce((a,l)=>a+l.q,0),tot=L.reduce((a,l)=>a+l.q*l.d.price,0);
  $('#bar').classList.toggle('show',n>0);
  $('#barTxt').textContent=n+(n===1?' dish · ':' dishes · ')+rs(tot);
  $('#orderOut').innerHTML='';
  if(!n){$('#cart').innerHTML='<p class="empty">Nothing yet. Tap “Add” on a dish above.</p>';return}
  $('#cart').innerHTML=L.map(l=>'<div class="line"><span>'+l.label+'</span><span class="qty"><button data-m="'+l.k+'" aria-label="Remove one '+l.label+'">−</button><b>'+l.q+'</b><button data-p="'+l.k+'" aria-label="Add one '+l.label+'">+</button></span><span>'+rs(l.q*l.d.price)+'</span></div>').join('')
   +'<div class="total"><span>Total</span><span>'+rs(tot)+'</span></div><div class="row"><button class="btn" id="sendOrder">Prepare my order</button><button class="btn ghost" id="clearOrder">Clear</button></div>';
}
function waLink(text){return 'https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(text)}
function showMessage(box,text,label){
  box.innerHTML='<div class="out"></div><div class="row" style="margin-top:12px"><a class="btn" target="_blank" rel="noopener" href="'+waLink(text)+'">'+label+'</a><button class="btn ghost" type="button" data-copy>Copy message</button></div>';
  box.querySelector('.out').textContent=text;
  box.querySelector('[data-copy]').onclick=e=>{const b=e.target;try{navigator.clipboard.writeText(text).then(()=>b.textContent='Copied')}catch(x){b.textContent='Select the text above to copy'}};
}

document.addEventListener('click',e=>{
  const t=e.target;
  if(t.dataset.c){cat=t.dataset.c;renderTabs();renderMenu()}
  if(t.dataset.s){const [id,b]=t.dataset.s.split(':');sel[id]=b;renderMenu()}
  if(t.classList.contains('add')){const d=MENU.find(x=>x.id==t.dataset.id),k=d.id+(d.base?':'+(sel[d.id]||d.base[0]):'');cart[k]=(cart[k]||0)+1;renderCart()}
  if(t.dataset.p){cart[t.dataset.p]++;renderCart()}
  if(t.dataset.m){if(--cart[t.dataset.m]<=0)delete cart[t.dataset.m];renderCart()}
  if(t.id==='clearOrder'){cart={};renderCart()}
  if(t.id==='sendOrder'){
    const L=cartLines(),tot=L.reduce((a,l)=>a+l.q*l.d.price,0),tn=$('#tableNo').value.trim(),nm=$('#custName').value.trim();
    if(!tn||!nm){$('#orderOut').innerHTML='<p class="empty">Enter your table number and name, then prepare your order again.</p>';(tn?$('#custName'):$('#tableNo')).focus();return}
    showMessage($('#orderOut'),'Hello La Kwizine Martiniere, I would like to order:\n'+L.map(l=>l.q+'× '+l.label+' — '+rs(l.q*l.d.price)).join('\n')+'\nTotal: '+rs(tot)+'\nTable: '+tn+'\nName: '+nm,'Send order on WhatsApp');
  }
});
$('#prot').addEventListener('input',renderMenu);

/* Booking form */
function buildTimes(){
  const d=new Date($('#date').value+'T12:00:00'),hr=CONFIG.hours[d.getDay()],opts=[];
  if(hr)for(let t=hr[0];t<=hr[1]-30;t+=30)opts.push('<option value="'+fmt(t)+'">'+fmt(t)+'</option>');
  $('#time').innerHTML=opts.length?opts.join(''):'<option>Closed this day</option>';
  if(opts.length&&hr[0]<=720&&hr[1]>750)$('#time').value=fmt(720);
}
$('#rform').addEventListener('submit',e=>{
  e.preventDefault();
  const f=new FormData(e.target),d=new Date(f.get('date')+'T12:00:00');
  const day=d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  if(!CONFIG.hours[d.getDay()]){$('#rout').innerHTML='<p class="empty">We are closed that day. Please pick another date.</p>';return}
  const g=+f.get('guests');
  showMessage($('#rout'),'Hello La Kwizine Martiniere, I would like to book a table for '+g+(g===1?' guest':' guests')+' on '+day+' at '+f.get('time')+'.\nName: '+f.get('name')+(f.get('note')?'\nNotes: '+f.get('note'):''),'Send booking on WhatsApp');
});

const PHOTOS=[
 {"src": "images/01-noodles-with-meat-and-a-fried-egg.jpg", "cap": "Noodles with meat and a fried egg", "alt": "Bowl of noodles with meat, fish balls, a fried egg and green chutney"},
 {"src": "images/02-chicken-noodles-with-fried-egg.jpg", "cap": "Chicken noodles with fried egg", "alt": "Four bowls of noodles topped with chicken and a fried egg"},
 {"src": "images/03-chicken-curry-rice-bowls.jpg", "cap": "Chicken curry rice bowls", "alt": "Six paper bowls of rice with chicken curry, potato, peas and pumpkin"},
 {"src": "images/04-briani-with-boiled-eggs.jpg", "cap": "Briani with boiled eggs", "alt": "Large pot of briani topped with boiled eggs and fresh herbs"},
 {"src": "images/05-dholl-puri-plate.jpg", "cap": "Dholl puri plate", "alt": "Steel plate with a dholl puri, bean curry, sausage rougail and vegetables"},
 {"src": "images/06-curry-and-rice-to-take-away.jpg", "cap": "Curry and rice to take away", "alt": "Two takeaway boxes of white rice with fish curry, aubergine and cucumber salad"},
 {"src": "images/07-puri-with-chickpea-curry.jpg", "cap": "Puri with chickpea curry", "alt": "Tray with puris, chickpea curry, rice and vegetables"},
 {"src": "images/08-chicken-sandwiches.jpg", "cap": "Chicken sandwiches", "alt": "Two baguette sandwiches filled with chicken, salad and sauces"},
 {"src": "images/09-burger-at-the-counter-table.jpg", "cap": "Burger at the counter table", "alt": "Burger with lettuce, tomato and cheese on a table inside the restaurant"},
 {"src": "images/10-burger-and-loaded-bowl.jpg", "cap": "Burger and loaded bowl", "alt": "Burger with chips beside a bowl topped with fish cake and spring onion"},
 {"src": "images/11-loaded-bowl.jpg", "cap": "Loaded bowl", "alt": "Bowl topped with fish cake, dumplings and spring onion"},
 {"src": "images/12-fresh-salad.jpg", "cap": "Fresh salad", "alt": "Platter of red cabbage, cucumber, lettuce, carrot and corn with lemon"}
];
function renderGallery(){$('#gal').innerHTML=PHOTOS.map((p,i)=>'<button data-g="'+i+'" aria-label="View photo: '+p.cap+'"><img src="'+p.src+'" alt="'+p.alt+'" loading="lazy"></button>').join('')}
let gi=0,lastBtn=null;
function openLb(i){gi=(i+PHOTOS.length)%PHOTOS.length;const p=PHOTOS[gi];$('#lbImg').src=p.src;$('#lbImg').alt=p.alt;$('#lbCap').textContent=p.cap+' ('+(gi+1)+' of '+PHOTOS.length+')';$('#lb').classList.add('open');document.body.style.overflow='hidden'}
function closeLb(){$('#lb').classList.remove('open');document.body.style.overflow='';if(lastBtn)lastBtn.focus()}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-g]');
  if(g){lastBtn=g;openLb(+g.dataset.g);$('.lbx').focus();return}
  const a=e.target.dataset.lb;
  if(a==='close'||e.target.id==='lb')closeLb();
  if(a==='prev')openLb(gi-1);
  if(a==='next')openLb(gi+1);
});
document.addEventListener('keydown',e=>{
  if(!$('#lb').classList.contains('open'))return;
  if(e.key==='Escape')closeLb();
  if(e.key==='ArrowLeft')openLb(gi-1);
  if(e.key==='ArrowRight')openLb(gi+1);
});
function init(){
  const today=new Date(),iso=new Date(today.getTime()-today.getTimezoneOffset()*6e4).toISOString().slice(0,10);
  $('#date').min=iso;$('#date').value=iso;
  $('#yr').textContent=today.getFullYear();$('#date').addEventListener('input',buildTimes);
  $('#mapLink').href=CONFIG.mapUrl;
  $('#callLink').href='tel:+'+CONFIG.whatsapp;
  $('#chatLink').href='https://wa.me/'+CONFIG.whatsapp;
  $('#phoneTxt').textContent=CONFIG.phone;
  const {day}=mauNow();
  $('#hours').innerHTML=[1,2,3,4,5,6,0].map(i=>{const h=CONFIG.hours[i];return '<tr class="'+(i===day?'today':'')+'"><td>'+DAYS[i]+'</td><td style="text-align:right">'+(h?fmt(h[0])+' – '+fmt(h[1]):'Closed')+'</td></tr>'}).join('');
  const pool=MENU.filter(x=>x.cat!==AO),feat=pool[day%pool.length];
  $('#potd').innerHTML='<small>Try today</small><h3>'+feat.en+'</h3><div>'+(feat.base?'Fried rice or noodles':feat.cat)+', '+rs(feat.price)+'</div>';
  renderGallery();buildTimes();renderTabs();renderMenu();renderCart();status();setInterval(status,60000);
}
init();
