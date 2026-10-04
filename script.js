/* ---- Edit these to update the site ---- */
const CONFIG={
  whatsapp:'23057894088',
  phone:'+230 5789 4088',
  mapUrl:'https://maps.app.goo.gl/RVJeiCinNRymQTDP9',
  // Opening hours in minutes from midnight, Mauritius time. null = closed. Index 0 = Sunday.
  hours:[[420,840],null,[540,840],[540,840],[540,840],[540,840],[540,900]]
};
const FR='Fried rice & noodles',BN='Boiled noodles',BR='Bol renversé',AO='Add-ons';
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
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const $=s=>document.querySelector(s);
const rs=n=>'Rs '+n.toLocaleString('en-US');
const fmt=t=>{const h=Math.floor(t/60),mm=String(t%60).padStart(2,'0');return (h%12||12)+':'+mm+(h<12?' am':' pm')};
const cats=['All',...new Set(MENU.map(d=>d.cat))];
let cat='All';

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
    return '<article class="dish"><div><h3>'+d.name+'</h3></div><div class="price">'+rs(d.price)+'</div><p>'+d.en+'</p><div class="meta"><span>'+d.cat+'</span>'+(d.special?'<span>Special</span>':'')+(d.tags.includes('veg')?'<span>Vegetarian</span>':'')+'</div></article>';
  }).join(''):'<p class="empty">No dishes match this filter. Choose “everything” to see the full menu.</p>';
}
document.addEventListener('click',e=>{const c=e.target.dataset.c;if(c){cat=c;renderTabs();renderMenu()}});
$('#prot').addEventListener('input',renderMenu);

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
  const today=new Date();
    $('#yr').textContent=today.getFullYear();
  $('#mapLink').href=CONFIG.mapUrl;
  $('#callLink').href='tel:+'+CONFIG.whatsapp;
  $('#chatLink').href='https://wa.me/'+CONFIG.whatsapp;
  $('#phoneTxt').textContent=CONFIG.phone;
  const {day}=mauNow();
  $('#hours').innerHTML=[1,2,3,4,5,6,0].map(i=>{const h=CONFIG.hours[i];return '<tr class="'+(i===day?'today':'')+'"><td>'+DAYS[i]+'</td><td style="text-align:right">'+(h?fmt(h[0])+' – '+fmt(h[1]):'Closed')+'</td></tr>'}).join('');
  const pool=MENU.filter(x=>x.cat!==AO),feat=pool[day%pool.length];
  $('#potd').innerHTML='<small>Try today</small><h3>'+feat.en+'</h3><div>'+(feat.base?'Fried rice or noodles':feat.cat)+', '+rs(feat.price)+'</div>';
  renderGallery();renderTabs();renderMenu();status();setInterval(status,60000);
}
init();
