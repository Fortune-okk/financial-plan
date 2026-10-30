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
 const d=$('#dlg');d.innerHTML=`<form id="mf"><h2>${esc(title)}</h2>${body}<p class="err" id="merr"></p><div class="row" style="justify-content:flex-end"><button type="button" class="ghost" onclick="$('#dlg').close()">Cancel</button><button class="primary">${ok}</button></div></form>`;
 $('#mf').onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;try{await onSubmit(new FormData(e.target));d.close()}catch(x){$('#merr').textContent=x.message||String(x);b.disabled=false}};
 d.showModal();
}
