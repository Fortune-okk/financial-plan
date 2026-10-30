const SUPABASE_URL='https://fjrwtkrldmugdburhqji.supabase.co';
const SUPABASE_KEY='sb_publishable_a4m9O1GQ4vyrtD00UEqNJw_naZRQ3UW';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>{n=Number(n)||0;const neg=n<0;n=Math.abs(n);return(neg?'-':'')+'E'+n.toLocaleString('en-US',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})};
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const sum=a=>a.reduce((s,x)=>s+Number(x.amount),0);
const catOpts=(cats,sel)=>cats.map(c=>`<option value="${c.id}" ${c.id===sel?'selected':''}>${esc(c.name)}</option>`).join('');
function toast(t){const e=$('#toast');if(!e)return;e.textContent=t;e.style.display='block';setTimeout(()=>e.style.display='none',3500)}
async function requireUser(){
 const {data:{session}}=await sb.auth.getSession();
 if(!session){location.replace('login.html');return null}
 sb.auth.onAuthStateChange(e=>{if(e==='SIGNED_OUT')location.replace('login.html')});
 return session.user;
}
async function signOut(){await sb.auth.signOut();location.replace('login.html')}
async function loadCats(){const r=await sb.from('categories').select('*').order('sort_order');if(r.error)throw r.error;return r.data||[]}
function modal(title,body,onSubmit,ok='Save'){
 const d=$('#dlg');d.innerHTML=`<form id="mf"><h2>${esc(title)}</h2>${body}<p class="err" id="merr"></p><div class="row" style="justify-content:flex-end"><button type="button" class="btn ghost" onclick="$('#dlg').close()">Cancel</button><button class="btn">${ok}</button></div></form>`;
 $('#mf').onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;try{await onSubmit(new FormData(e.target));d.close()}catch(x){$('#merr').textContent=x.message||String(x);b.disabled=false}};
 d.showModal();
}
const ICONS={
 'House rent':'<path d="M3 11l9-8 9 8v10H3z"/><path d="M9 21v-6h6v6"/>',
 'Groceries':'<path d="M3 4h3l2.5 11h10L21 7H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/>',
 'Transport':'<rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M8 21v-4M16 21v-4"/>',
 'Shopping':'<path d="M5 8h14l-1 13H6z"/><path d="M9 8a3 3 0 016 0"/>',
 'Debts':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
 'Savings':'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4"/>',
 'Living (everyday)':'<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.4 1 2.5h6c0-1.1.3-1.8 1-2.5A6 6 0 0012 3z"/>',
 '_':'<path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.5"/>',
 'home':'<path d="M3 11l9-8 9 8v10H3z"/><path d="M9 21v-6h6v6"/>','cart':'<path d="M3 4h3l2.5 11h10L21 7H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/>',
 'bag':'<path d="M5 8h14l-1 13H6z"/><path d="M9 8a3 3 0 016 0"/>','card':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
 'coin':'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4"/>',
 'scan':'<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><path d="M8 12h8"/>',
 'out':'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>','list':'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'};
const icon=(n,size=22,col='#0A0A0A')=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||ICONS._}</svg>`;
/* status pill, bar colour and footer line for a category card */
function catStatus(c,spent,bud,daysLeft){
 if(!bud)return{pill:'No budget',cls:'mut',bar:'#A1A1AA',pct:0,foot:'Set a budget to track this'};
 const pct=Math.min(100,Math.round(spent/bud*100)),left=bud-spent;
 if(c.kind==='savings')return{pill:pct>=100?'Goal reached':pct+'% saved',cls:'ok',bar:'#22C55E',pct,foot:left>0?money(left)+' still to set aside':'Goal reached'};
 if(c.kind==='debt')return{pill:pct>=100?'Paid off':pct+'% paid',cls:'ok',bar:'#22C55E',pct,foot:left>0?money(left)+' left to pay':'Paid off'};
 if(left<0)return{pill:'Over',cls:'bad',bar:'#EF4444',pct:100,foot:'Over by '+money(-left)};
 if(left===0)return{pill:c.name==='House rent'?'Paid':'At limit',cls:c.name==='House rent'?'ok':'warn',bar:c.name==='House rent'?'#22C55E':'#F59E0B',pct:100,foot:c.name==='House rent'?'Fully paid':'Nothing left'};
 if(spent/bud>=.85)return{pill:'Watch',cls:'warn',bar:'#F59E0B',pct,foot:money(left)+' left'+(daysLeft?' · about '+money(Math.round(left/daysLeft))+' a day':'')};
 return{pill:spent?'On track':'Not started',cls:'ok',bar:'#22C55E',pct,foot:money(left)+' left'+(daysLeft?' · about '+money(Math.round(left/daysLeft))+' a day':'')};
}
