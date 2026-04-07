
// Custom Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx-6+'px';cursor.style.top=my-6+'px';});
function animRing(){rx+=(mx-rx-18)*0.12;ry+=(my-ry-18)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);}
animRing();
document.querySelectorAll('a,button,.sol-card,.cc,.tcard').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.transform='scale(2)';ring.style.transform='scale(1.5)';});
  el.addEventListener('mouseleave',()=>{cursor.style.transform='scale(1)';ring.style.transform='scale(1)';});
});

function switchUV(type,el){
  document.querySelectorAll('.uv-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.uv-panel').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('uvp-'+type).classList.add('active');
}

window.addEventListener('scroll',()=>{document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>50);});

const observer=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('visible'),i*80);});},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Dashboard Chart
const ctx=document.getElementById('dashChart').getContext('2d');
const labels=[],data=[];
for(let h=0;h<24;h++){labels.push(h+':00');const f=Math.max(0,Math.exp(-0.07*Math.pow(h-13,2)));data.push(+(f*1400*(0.8+Math.random()*0.2)).toFixed(0));}
new Chart(ctx,{type:'line',data:{labels,datasets:[{data,fill:true,backgroundColor:'rgba(245,166,35,0.07)',borderColor:'#F5A623',borderWidth:2,pointRadius:0,tension:0.4}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#8892A4',font:{family:'JetBrains Mono',size:9}},grid:{color:'rgba(255,255,255,0.04)'}},y:{ticks:{color:'#8892A4',font:{family:'JetBrains Mono',size:9}},grid:{color:'rgba(255,255,255,0.04)'}}}}});

// Panel Grid
const pg=document.getElementById('panel-grid');
if(pg){for(let i=0;i<36;i++){const c=document.createElement('div');c.className='pg-cell';c.style.animationDelay=(i*0.07)+'s';if(i===11){c.style.background='rgba(245,166,35,0.4)';c.title='Warning';}pg.appendChild(c);}}

// Calculator
const COUNTRY_DATA={IN:{sym:'₹',tariff:7.5,costPerKw:45000,irr:5.3,subsidy:(kw)=>kw<=2?30000:kw<=3?60000:78000,co2:0.82},US:{sym:'$',tariff:0.14,costPerKw:2800,irr:5.5,subsidy:(kw)=>kw*2800*0.30,co2:0.42},ZA:{sym:'R',tariff:2.85,costPerKw:18000,irr:5.8,subsidy:()=>0,co2:0.9},AU:{sym:'A$',tariff:0.28,costPerKw:1100,irr:5.4,subsidy:(kw)=>kw*800,co2:0.65},DE:{sym:'€',tariff:0.32,costPerKw:1400,irr:3.8,subsidy:()=>0,co2:0.37},AE:{sym:'AED',tariff:0.38,costPerKw:6500,irr:6.0,subsidy:()=>0,co2:0.44}};

function calcSolar(){
  const bill=parseFloat(document.getElementById('cb-bill')?.value)||0;
  const ctry=document.getElementById('cb-country')?.value||'IN';
  if(!bill||bill<100)return;
  const d=COUNTRY_DATA[ctry];
  const units=bill/d.tariff;
  const kw=Math.max(1,+(units/(d.irr*26)).toFixed(2));
  const cost=kw*d.costPerKw;
  const sub=d.subsidy(kw);
  const net=Math.max(0,cost-sub);
  const annSave=units*d.tariff*12;
  const payback=+(net/annSave).toFixed(1);
  const lifetime=Math.round(annSave*25-net);
  const co2=Math.round(units*12*d.co2);
  const sym=d.sym;
  const fmt=(n)=>{if(sym==='₹')return n>=100000?`${sym}${(n/100000).toFixed(1)}L`:`${sym}${Math.round(n).toLocaleString('en-IN')}`;return`${sym}${n>=1000?(n/1000).toFixed(1)+'K':Math.round(n).toLocaleString()}`;};
  document.getElementById('calc-results').innerHTML=`<div class="cr-card"><div class="cr-val">${kw} kW</div><div class="cr-lbl">System Size</div></div><div class="cr-card"><div class="cr-val">${fmt(annSave/12)}</div><div class="cr-lbl">Monthly Savings</div></div><div class="cr-card"><div class="cr-val">${payback} yrs</div><div class="cr-lbl">Payback Period</div></div><div class="cr-card"><div class="cr-val">${fmt(lifetime)}</div><div class="cr-lbl">25-Year Net Savings</div></div><div class="cr-card"><div class="cr-val">${co2} kg</div><div class="cr-lbl">CO₂ Saved/Year</div></div><div class="cr-card"><div class="cr-val">${fmt(net)}</div><div class="cr-lbl">Net Cost After Subsidy</div></div>`;
}

// Chatbot
let chatOpen=false;
function toggleChat(){chatOpen=!chatOpen;document.getElementById('chatWindow').classList.toggle('open',chatOpen);if(chatOpen){document.querySelector('.chat-badge').style.display='none';document.getElementById('chatInput').focus();}}
function openChat(){if(!chatOpen)toggleChat();setTimeout(()=>document.getElementById('chatInput').focus(),300);}

const KB={
  'system size':{text:"🔆 **System Sizing Guide:**\n\nFor most markets:\n• Residential: 3-10 kW\n• Commercial: 25-500 kW\n• Industrial: 500 kW – 10 MW\n\nYour required kW = Monthly Units ÷ (Sunshine hrs × 26 days)\n\n👉 Use our **Solar Calculator** above for exact sizing!"},
  'india':{text:"🇮🇳 **India Solar — PM Surya Ghar Yojana:**\n\n• Subsidy: ₹30,000 (1-2 kW), ₹60,000 (2-3 kW), ₹78,000 (3+ kW)\n• Apply at: pmsuryaghar.gov.in\n• Grid: DISCOM net metering required\n• MNRE certified installers only\n• Average tariff: ₹6-8/unit\n• Payback: 4-6 years"},
  'south africa':{text:"🇿🇦 **South Africa Solar:**\n\n• SSEG registration with Eskom/Municipality required\n• NERSA licensed installer needed\n• Section 12B tax incentive available\n• Eskom tariff: R2.85–3.50/kWh\n• High irradiance: 5.5–6.5 peak sun hours\n• Load-shedding alerts integrated in our platform\n\nSolar payback in SA: 3-5 years!"},
  'usa':{text:"🇺🇸 **USA Solar Incentives:**\n\n• Federal ITC: 30% Investment Tax Credit\n• SGIP Battery Incentive: California, NY, NJ\n• SREC Markets: MA, NJ, DC, OH, PA\n• Net Metering: 40+ states\n• Average tariff: $0.12–0.16/kWh\n• Payback: 4-6 years after ITC"},
  'mobile app':{text:"📱 **Mobile App Development:**\n\nWe build native iOS & Android solar management apps:\n\n✅ Real-time monitoring dashboard\n✅ Push notifications for alerts\n✅ Bill & revenue tracking\n✅ Maintenance scheduling\n✅ WhatsApp/SMS alerts\n✅ Multi-language support\n\n**Timeline:** 8-12 weeks\n\nWant to discuss your app requirements?"},
  'demo':{text:"🚀 **Request a Demo:**\n\nOur 30-minute demo includes:\n• Live platform walkthrough\n• Your market-specific features\n• ROI calculation for your portfolio\n• Mobile app preview\n\n📧 Email: demo@solaraxis.io\n📞 India: +91 98765 43210\n📞 USA: +1 (888) 765-4321\n📞 SA: +27 11 765 4321\n\nOr click 'Start Free Trial' — no credit card needed!"},
  'cost':{text:"💰 **SolarAxis Pricing:**\n\n• **Starter:** Free (up to 3 plants)\n• **Growth:** $49/month (up to 25 plants)\n• **Business:** $149/month (up to 200 plants)\n• **Enterprise:** Custom (unlimited)\n\nAll plans include real-time monitoring, AI diagnostics, mobile app & subsidy tracking.\n\n30-day free trial on all paid plans!"},
  'uv':{text:"☀️ **UV Rays & Solar Panels:**\n\n**UV-C (100–280nm):** Completely blocked by ozone — used in accelerated aging tests for panels\n**UV-B (280–315nm):** ~5% reaches Earth — causes EVA encapsulant yellowing over time\n**UV-A (315–400nm):** ~95% of UV reaches surface — silicon cells absorb UV-A and generate electricity!\n\n☁️ Even on cloudy days, UV-A penetrates clouds and keeps panels generating 10–25% of rated power!"},
  'efficiency':{text:"⚡ **Solar Panel Efficiency:**\n\n• **Monocrystalline:** 20–22%\n• **PERC / TOPCon:** 21–24% (most popular)\n• **HJT / IBC:** 23–26% (premium)\n• **Lab record:** 47.6% (multi-junction)\n\n📉 Degradation: ~0.5% per year — after 25 years, panel produces ~88% of original rated power\n\n🌡️ Every 1°C above 25°C reduces output by ~0.4%"},
  'how':{text:"🔬 **How Solar Panels Work:**\n\n1️⃣ **Photon hits panel** → passes through AR-coated glass\n2️⃣ **Photoelectric effect** → photon knocks electron free in silicon P-N junction\n3️⃣ **Electric field** → separates electrons & holes, creates DC current\n4️⃣ **Busbars collect** electrons from all cells in the string\n5️⃣ **Inverter converts** DC → AC at 50/60 Hz\n6️⃣ **Powers your home** → excess exported to grid for net metering credit 💰"},
  'spectrum':{text:"🌈 **Solar Spectrum Breakdown:**\n\n• **UV (< 400nm):** ~7% of solar energy\n• **Visible (400–700nm):** ~46% — primary generation range for silicon\n• **Near-IR (700–1400nm):** ~37% — silicon's peak efficiency zone (800–950nm)\n• **Mid/Far-IR (1400nm+):** ~10% — mostly becomes heat in panel\n\n🎯 Silicon solar cells respond to 300–1100nm — capturing UV-A, all visible, and near-infrared light!"},
  'default':{text:"☀️ Hi! I'm SolarBot. I can help with:\n• 📐 System sizing & calculator\n• 💰 ROI & payback calculations\n• 🏦 Subsidy info (MNRE, ITC, SSEG)\n• 📱 Mobile app development\n• 📊 Platform features & pricing\n• 🌍 Country-specific regulations\n• 🔬 Solar science & UV rays\n\nWhat would you like to know?"}
};

function findResponse(msg){
  const m=msg.toLowerCase();
  if(m.includes('uv')||m.includes('ultraviolet'))return KB.uv;
  if(m.includes('spectrum')||m.includes('infrared')||m.includes('wavelength'))return KB.spectrum;
  if(m.includes('efficien')||m.includes('perc')||m.includes('topcon')||m.includes('hjt'))return KB.efficiency;
  if((m.includes('how')&&(m.includes('work')||m.includes('does')))||m.includes('photoelectric')||m.includes('photovoltaic'))return KB.how;
  if(m.includes('india')||m.includes('mnre')||m.includes('surya'))return KB.india;
  if(m.includes('south africa')||m.includes('eskom')||m.includes('nersa')||m.includes('sseg'))return KB['south africa'];
  if(m.includes('usa')||m.includes('itc')||m.includes('sgip')||m.includes('america'))return KB.usa;
  if(m.includes('app')||m.includes('mobile')||m.includes('ios')||m.includes('android'))return KB['mobile app'];
  if(m.includes('demo')||m.includes('trial')||m.includes('contact'))return KB.demo;
  if(m.includes('cost')||m.includes('price')||m.includes('pricing'))return KB.cost;
  if(m.includes('size')||m.includes('kw')||m.includes('system'))return KB['system size'];
  return KB.default;
}

function nowTime(){return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});}

function addMsg(text,role){
  const msgs=document.getElementById('chatMsgs');
  const div=document.createElement('div');
  div.className=`msg ${role}`;
  const formatted=text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  div.innerHTML=`<div class="msg-avatar ${role}">${role==='bot'?'🤖':'👤'}</div><div><div class="msg-bubble">${formatted}</div><div class="msg-time">${nowTime()}</div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
}

function showTyping(){
  const msgs=document.getElementById('chatMsgs');
  const div=document.createElement('div');
  div.className='msg';div.id='typing-indicator';
  div.innerHTML=`<div class="msg-avatar bot">🤖</div><div><div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>`;
  msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;
}
function removeTyping(){const t=document.getElementById('typing-indicator');if(t)t.remove();}

function sendChat(){
  const input=document.getElementById('chatInput');
  const msg=input.value.trim();
  if(!msg)return;
  addMsg(msg,'user');input.value='';
  document.getElementById('quickReplies').style.display='none';
  showTyping();
  setTimeout(()=>{removeTyping();addMsg(findResponse(msg).text,'bot');},900+Math.random()*600);
}
function quickChat(msg){document.getElementById('chatInput').value=msg;sendChat();}

setTimeout(()=>{if(!chatOpen){document.getElementById('chatWindow').classList.add('open');chatOpen=true;document.querySelector('.chat-badge').style.display='none';}},8000);

setInterval(()=>{const val=Math.round(800+Math.random()*100);const el=document.getElementById('pm-live');if(el)el.textContent=val+' kW';},2500);

document.getElementById('hamburger')?.addEventListener('click',()=>{
  const links=document.querySelector('.nav-links');
  if(links){links.style.display=links.style.display==='flex'?'none':'flex';links.style.flexDirection='column';links.style.position='absolute';links.style.top='72px';links.style.left='0';links.style.right='0';links.style.background='rgba(8,12,20,0.97)';links.style.padding='20px';links.style.borderBottom='1px solid var(--border)';links.style.gap='4px';}
});

setTimeout(calcSolar,500);

const progressBar=document.getElementById('scrollProgress');
const backBtn=document.getElementById('backToTop');
window.addEventListener('scroll',()=>{
  const scrolled=window.scrollY;
  const total=document.body.scrollHeight-window.innerHeight;
  if(progressBar)progressBar.style.width=(scrolled/total*100)+'%';
  if(backBtn)backBtn.classList.toggle('show',scrolled>400);
  document.querySelectorAll('[data-section]').forEach(link=>{
    const sec=document.getElementById(link.dataset.section);
    if(!sec)return;
    const r=sec.getBoundingClientRect();
    link.classList.toggle('active',r.top<=80&&r.bottom>80);
  });
},{passive:true});

if(backBtn)backBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

function showToast(msg){
  const t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}
