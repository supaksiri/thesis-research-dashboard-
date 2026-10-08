const sectionIds = ['overview','current-desired','priority','areas','swot','tows','strategies','evaluation'];
const navItems = [
  ['overview','Overview','⌂'],['current-desired','Current–Desired','↔'],['priority','Priority Needs','⇧'],['areas','6 Academic Areas','▦'],
  ['swot','SWOT','◇'],['tows','TOWS','⊞'],['strategies','Strategies','◎'],['evaluation','Evaluation','✓']
];
let activeIndex = 0;
let presentationMode = false;

const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => [...root.querySelectorAll(sel)];
const fmt2 = n => Number(n).toFixed(2);
const fmt4 = n => Number(n).toFixed(4);

function pageHeading(kicker, title, subtitle='') {
  return `<div class="section-heading reveal"><div><div class="eyebrow">${kicker}</div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div></div>`;
}

function panel(title, body, extra='') {
  return `<article class="panel reveal ${extra}"><div class="panel-header"><h3>${title}</h3></div>${body}</article>`;
}

function rankBadge(rank) {
  const cls = rank <= 3 ? 'rank-hot' : 'rank-blue';
  return `<span class="rank-badge ${cls}">#${rank}</span>`;
}

function renderNav() {
  qs('#nav').innerHTML = navItems.map(([id,label,icon],i) => `
    <button class="nav-item ${i===0?'active':''}" data-target="${id}" title="${label}">
      <span class="nav-icon">${icon}</span><span class="nav-label">${label}</span>
    </button>`).join('');
}

function renderOverview() {
  const o = researchData.overall;
  qs('#overview').innerHTML = `
    <div class="hero reveal">
      <div class="hero-copy">
        <div class="eyebrow hero-eyebrow">MASTER'S THESIS · RESEARCH DASHBOARD</div>
        <h2>${researchData.meta.chapter}</h2>
        <p>จากข้อมูลเชิงประจักษ์สู่การพัฒนากลยุทธ์การบริหารงานวิชาการ</p>
        <div class="hero-meta">
          <span>${researchData.meta.title}</span>
          <span>ผู้วิจัย <strong>${researchData.meta.researcher}</strong></span>
        </div>
      </div>
      <div class="hero-orbit" aria-hidden="true"><div class="orbit-ring"></div><div class="orbit-core">4</div></div>
    </div>
    <div class="kpi-grid six">
      ${kpiCard('สภาพปัจจุบันโดยรวม', o.current.value, o.current.level, 'blue')}
      ${kpiCard('สภาพที่พึงประสงค์โดยรวม', o.desired.value, o.desired.level, 'orange')}
      <article class="kpi-card priority reveal"><div class="kpi-top"><span class="kpi-label">ความต้องการจำเป็นอันดับ 1</span><span class="kpi-dot orange"></span></div><div class="kpi-text">${o.topPriority.label}</div><div class="kpi-sub">PNI = <strong>${fmt4(o.topPriority.pni)}</strong></div></article>
      ${kpiCard('กลยุทธ์หลัก', o.mainStrategies, 'กลยุทธ์', 'green', 0)}
      ${kpiCard('กลยุทธ์รอง', o.subStrategies, 'กลยุทธ์', 'purple', 0)}
      ${kpiCard('วิธีดำเนินการ', o.methods, 'วิธี', 'blue', 0)}
    </div>
    <div class="storyline reveal">
      ${['Where are we now?','Where do we want to be?','What needs urgent development?','What is our context?','How do we formulate strategies?','What strategies were developed?','Are they appropriate and feasible?'].map((x,i)=>`<div class="story-step"><span>${i+1}</span><strong>${x}</strong></div>`).join('<div class="story-arrow">→</div>')}
    </div>`;
}

function kpiCard(label, value, level, tone='blue', decimals=2) {
  return `<article class="kpi-card reveal"><div class="kpi-top"><span class="kpi-label">${label}</span><span class="kpi-dot ${tone}"></span></div><div class="kpi-value count-up" data-value="${value}" data-decimals="${decimals}">0</div><div class="kpi-sub">ระดับ <strong>${level}</strong></div></article>`;
}

function renderCurrentDesired() {
  const gaps = researchData.areas;
  const highestCurrent = [...gaps].sort((a,b)=>b.current-a.current)[0];
  const lowestCurrent = [...gaps].sort((a,b)=>a.current-b.current)[0];
  const highestDesired = [...gaps].sort((a,b)=>b.desired-a.desired)[0];
  qs('#current-desired').innerHTML = `
    ${pageHeading('CURRENT → DESIRED','สภาพปัจจุบันและสภาพที่พึงประสงค์','เปรียบเทียบค่าเฉลี่ยรายด้านบนมาตราส่วน 5 ระดับ')}
    <div class="two-col chart-layout">
      ${panel('เปรียบเทียบ Current vs Desired','<div class="chart-box tall"><canvas id="currentDesiredChart"></canvas></div>','chart-panel')}
      <div class="highlight-stack">
        ${highlightCard('Current Highest',highestCurrent.name,highestCurrent.current,'blue')}
        ${highlightCard('Current Lowest',lowestCurrent.name,lowestCurrent.current,'navy')}
        ${highlightCard('Desired Highest',highestDesired.name,highestDesired.desired,'orange')}
      </div>
    </div>
    ${panel('Gap Analysis',`<div class="table-wrap"><table><thead><tr><th>ด้าน</th><th>Current</th><th>Desired</th><th>Gap</th></tr></thead><tbody>${gaps.map(a=>`<tr><td>${a.name}</td><td><span class="data-pill blue">${fmt2(a.current)}</span></td><td><span class="data-pill orange">${fmt2(a.desired)}</span></td><td><strong>${fmt2(a.gap)}</strong><div class="mini-progress"><span style="width:${a.gap/0.89*100}%"></span></div></td></tr>`).join('')}</tbody></table></div>`)}
  `;
}

function highlightCard(kicker,title,value,tone) {
  return `<article class="highlight-card reveal ${tone}"><div class="mini-label">${kicker}</div><strong>${title}</strong><div class="highlight-number">${fmt2(value)}</div></article>`;
}

function renderPriority() {
  const ranked = [...researchData.areas].sort((a,b)=>a.rank-b.rank);
  qs('#priority').innerHTML = `
    ${pageHeading('PRIORITY NEEDS','ลำดับความต้องการจำเป็นในการพัฒนา','PNI Modified Ranking · เน้น 3 อันดับแรกเป็นลำดับเร่งด่วน')}
    <div class="two-col chart-layout">
      ${panel('PNI Modified Ranking','<div class="chart-box tall"><canvas id="priorityChart"></canvas></div>','chart-panel')}
      <div class="priority-side">
        ${panel('Priority Development',`<div class="tag-list hot">${researchData.priority.development.map(x=>`<span>${x}</span>`).join('')}</div><p class="panel-note">${researchData.priority.insight}</p>`)}
        ${panel('Maintain & Enhance',`<div class="tag-list cool">${researchData.priority.maintain.map(x=>`<span>${x}</span>`).join('')}</div>`)}
      </div>
    </div>
    <div class="ranking-grid">${ranked.map(a=>`<article class="ranking-card reveal ${a.rank<=3?'urgent':''}">${rankBadge(a.rank)}<div><strong>${a.name}</strong><span>PNI ${fmt4(a.pni)}</span></div></article>`).join('')}</div>`;
}

function renderAreas() {
  qs('#areas').innerHTML = `
    ${pageHeading('6 ACADEMIC AREAS','6 ด้านการบริหารงานวิชาการ','คลิกแต่ละการ์ดเพื่อดูประเด็นความต้องการจำเป็นสำคัญ')}
    <div class="area-grid">${researchData.areas.map(area=>`<article class="area-card reveal ${area.rank<=3?'priority-area':''}" data-area="${area.id}">
      <div class="area-card-head"><div class="area-number">0${area.id}</div>${rankBadge(area.rank)}</div>
      <h3>${area.name}</h3>
      <div class="area-metrics">
        <div><span>Current</span><strong>${fmt2(area.current)}</strong></div><div><span>Desired</span><strong>${fmt2(area.desired)}</strong></div><div><span>Gap</span><strong>${fmt2(area.gap)}</strong></div><div><span>PNI</span><strong>${fmt4(area.pni)}</strong></div>
      </div>
      <div class="area-priority"><span>Key Priority Item</span><p>${area.keyPriority}</p></div>
    </article>`).join('')}</div>`;
}

function swotQuad(type,title,items,klass,letter) {
  return `<article class="swot-card reveal ${klass}"><div class="swot-head"><span>${letter}</span><div><div class="mini-label">${type}</div><h3>${title}</h3></div></div><div class="swot-list">${items.map(x=>`<div>${x}</div>`).join('')}</div></article>`;
}

function renderSWOT() {
  const s = researchData.swot;
  qs('#swot').innerHTML = `
    ${pageHeading('ENVIRONMENTAL ANALYSIS','การวิเคราะห์สภาพแวดล้อม','แสดงเฉพาะรหัสและช่วงรายการตามข้อมูลที่มี โดยไม่สร้างข้อความ SWOT รายข้อเพิ่มเติม')}
    <div class="swot-grid">
      ${swotQuad('Strengths','จุดแข็ง',s.strengths,'strength','S')}
      ${swotQuad('Weaknesses','จุดอ่อน',s.weaknesses,'weakness','W')}
      ${swotQuad('Opportunities','โอกาส',s.opportunities,'opportunity','O')}
      ${swotQuad('Threats','ภาวะคุกคาม',s.threats,'threat','T')}
    </div>
    <div class="info-strip reveal">ⓘ ${s.note} · ${researchData.fallback}</div>`;
}

function renderTOWS() {
  const t = researchData.tows;
  qs('#tows').innerHTML = `
    ${pageHeading('STRATEGY FORMULATION','จาก SWOT สู่ TOWS Matrix','แสดงเส้นทางการสังเคราะห์จากผลวิเคราะห์สู่กลยุทธ์ฉบับสุดท้าย')}
    <div class="flow-track reveal">${t.flow.map((x,i)=>`<div class="flow-node"><span>${i+1}</span><strong>${x}</strong></div>${i<t.flow.length-1?'<div class="flow-connector">→</div>':''}`).join('')}</div>
    <div class="tows-grid">${t.matrix.map(m=>`<article class="tows-card reveal ${m.code.toLowerCase()}"><div class="tows-code">${m.code}</div><h3>${m.title}</h3><p>${m.text}</p></article>`).join('')}</div>
    <div class="example-card reveal"><span class="mini-label">ตัวอย่างการอ่านรหัส</span><strong>${t.example}</strong></div>
    <div class="warning-card reveal">⚠ ${t.warning}</div>`;
}

function renderStrategies() {
  qs('#strategies').innerHTML = `
    ${pageHeading('FINAL STRATEGY','กลยุทธ์การบริหารงานวิชาการที่พัฒนาขึ้น','ผลลัพธ์สุดท้ายหลังการพัฒนาและปรับปรุงกลยุทธ์')}
    <div class="mini-kpi-row reveal"><div><strong>${researchData.overall.mainStrategies}</strong><span>กลยุทธ์หลัก</span></div><div><strong>${researchData.overall.subStrategies}</strong><span>กลยุทธ์รอง</span></div><div><strong>${researchData.overall.methods}</strong><span>วิธีดำเนินการ</span></div></div>
    <div class="strategy-list">${researchData.strategies.map(s=>`<article class="strategy-card reveal" data-strategy="${s.id}">
      <button class="strategy-summary" aria-expanded="false">
        <div class="strategy-id">${String(s.id).padStart(2,'0')}</div>
        <div class="strategy-title"><span>STRATEGY ${s.id}</span><h3>${s.title}</h3><div class="strategy-stats"><b>${s.subs}</b> กลยุทธ์รอง · <b>${s.methods}</b> วิธีดำเนินการ</div></div>
        <span class="expand-icon">＋</span>
      </button>
      <div class="strategy-details"><div class="detail-inner"><div class="mini-label">สาระสำคัญ</div><div class="point-grid">${s.points.map(p=>`<span>✓ ${p}</span>`).join('')}</div></div></div>
    </article>`).join('')}</div>`;
}

function renderEvaluation() {
  const e = researchData.evaluation;
  qs('#evaluation').innerHTML = `
    ${pageHeading('STRATEGY VALIDATION','ผลการประเมินความเหมาะสมและความเป็นไปได้','ผลประเมินกลยุทธ์หลัก กลยุทธ์รอง และวิธีดำเนินการ')}
    <div class="two-col chart-layout evaluation-layout">
      ${panel('กลยุทธ์หลัก 6 กลยุทธ์','<div class="chart-box tall"><canvas id="evaluationChart"></canvas></div>','chart-panel')}
      <div class="eval-summary">${e.summary.map((x,i)=>`<article class="eval-card reveal"><div class="eval-card-title">${x.label}</div><div class="eval-values"><div><span>Appropriateness</span><strong>${fmt2(x.appropriate)}</strong><em>${x.appropriateLevel}</em></div><div><span>Feasibility</span><strong>${fmt2(x.feasible)}</strong><em>${x.feasibleLevel}</em></div></div></article>`).join('')}</div>
    </div>
    <div class="insight-card reveal"><div class="insight-icon">✦</div><div><span class="mini-label">Key Insight</span><p>“${e.insight}”</p></div></div>`;
}

function animateCounts(root=document) {
  qsa('.count-up',root).forEach(el=>{
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.value);
    const decimals = parseInt(el.dataset.decimals || '0',10);
    const start = performance.now(), duration=700;
    const tick = now => {
      const p = Math.min((now-start)/duration,1);
      const eased = 1 - Math.pow(1-p,3);
      el.textContent = (target*eased).toFixed(decimals);
      if (p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function revealActiveSection() {
  const sec = qs(`#${sectionIds[activeIndex]}`);
  qsa('.reveal',sec).forEach((el,i)=>setTimeout(()=>el.classList.add('in'), Math.min(i*55,420)));
  animateCounts(sec);
  renderChartsForSection(sectionIds[activeIndex]);
}

function goToSection(index, smooth=true) {
  activeIndex = Math.max(0,Math.min(sectionIds.length-1,index));
  const id = sectionIds[activeIndex];
  qsa('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.target===id));
  const target = qs(`#${id}`);
  qs('#topbarTitle').textContent = target.dataset.title;
  qs('#presentationCounter').textContent = `${activeIndex+1} / ${sectionIds.length}`;
  if (presentationMode) {
    qsa('.dashboard-section').forEach((s,i)=>s.classList.toggle('active-section',i===activeIndex));
    revealActiveSection();
  } else {
    target.scrollIntoView({behavior:smooth?'smooth':'auto',block:'start'});
    setTimeout(revealActiveSection, smooth?260:0);
  }
}

function setPresentation(on) {
  presentationMode = on;
  document.body.classList.toggle('presentation-mode',on);
  qs('#presentationControls').setAttribute('aria-hidden', String(!on));
  qs('#presentationControls').classList.toggle('show',on);
  if (on) {
    qsa('.dashboard-section').forEach((s,i)=>s.classList.toggle('active-section',i===activeIndex));
    goToSection(activeIndex,false);
  } else {
    qsa('.dashboard-section').forEach(s=>s.classList.add('active-section'));
    qs(`#${sectionIds[activeIndex]}`).scrollIntoView({behavior:'auto'});
  }
}

function bindEvents() {
  qs('#nav').addEventListener('click',e=>{
    const item=e.target.closest('.nav-item'); if(!item)return;
    goToSection(sectionIds.indexOf(item.dataset.target));
    document.body.classList.remove('drawer-open');
  });
  qs('#sidebarCollapse').addEventListener('click',()=>document.body.classList.toggle('sidebar-collapsed'));
  qs('#mobileMenu').addEventListener('click',()=>document.body.classList.toggle('drawer-open'));
  qs('#presentationBtn').addEventListener('click',()=>setPresentation(true));
  qs('#exitPresentation').addEventListener('click',()=>setPresentation(false));
  qs('#prevSection').addEventListener('click',()=>goToSection(activeIndex-1,false));
  qs('#nextSection').addEventListener('click',()=>goToSection(activeIndex+1,false));
  qs('#fullscreenBtn').addEventListener('click',toggleFullscreen);
  qs('#exportMenuBtn').addEventListener('click',()=>qs('#exportMenu').classList.toggle('show'));
  document.addEventListener('click',e=>{ if(!e.target.closest('.export-menu-wrap')) qs('#exportMenu').classList.remove('show'); });
  qs('#exportMenu').addEventListener('click',e=>{ const b=e.target.closest('button[data-export]'); if(!b)return; qs('#exportMenu').classList.remove('show'); handleExport(b.dataset.export); });
  qs('#strategies').addEventListener('click',e=>{
    const btn=e.target.closest('.strategy-summary'); if(!btn)return;
    const card=btn.closest('.strategy-card'); const open=card.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open)); btn.querySelector('.expand-icon').textContent=open?'−':'＋';
  });
  document.addEventListener('keydown',e=>{
    if (!presentationMode) return;
    if (e.key==='ArrowRight' || e.key==='PageDown') goToSection(activeIndex+1,false);
    if (e.key==='ArrowLeft' || e.key==='PageUp') goToSection(activeIndex-1,false);
    if (e.key==='Escape') setPresentation(false);
  });
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch { showToast('อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับ Fullscreen'); }
}

function showToast(msg) {
  const t=qs('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600);
}
function setLoading(on) { qs('#loadingOverlay').classList.toggle('show',on); qs('#loadingOverlay').setAttribute('aria-hidden',String(!on)); }

async function captureSection(section) {
  if (typeof html2canvas === 'undefined') throw new Error('html2canvas not loaded');
  const wasPresentation = presentationMode;
  if (wasPresentation) setPresentation(false);
  section.classList.add('exporting');
  const canvas = await html2canvas(section,{scale:2,useCORS:true,backgroundColor:'#F5F7FB',logging:false,windowWidth:1440});
  section.classList.remove('exporting');
  if (wasPresentation) setPresentation(true);
  return canvas;
}

async function exportPNG() {
  setLoading(true);
  try {
    const section=qs(`#${sectionIds[activeIndex]}`); const canvas=await captureSection(section);
    const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download=`research-dashboard-${sectionIds[activeIndex]}.png`; a.click();
    showToast('Export PNG สำเร็จ');
  } catch(err){ showToast('ไม่สามารถ Export PNG ได้'); console.error(err); } finally { setLoading(false); }
}

async function exportPDF() {
  setLoading(true);
  try {
    if (!window.jspdf) throw new Error('jsPDF not loaded');
    const { jsPDF }=window.jspdf; const pdf=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
    for (let i=0;i<sectionIds.length;i++) {
      if (i>0) pdf.addPage('a4','landscape');
      const canvas=await captureSection(qs(`#${sectionIds[i]}`));
      const img=canvas.toDataURL('image/jpeg',0.92); const pageW=297,pageH=210;
      const ratio=Math.min(pageW/canvas.width,pageH/canvas.height); const w=canvas.width*ratio,h=canvas.height*ratio;
      pdf.addImage(img,'JPEG',(pageW-w)/2,(pageH-h)/2,w,h,undefined,'FAST');
    }
    pdf.save('thesis-research-dashboard-chapter4.pdf'); showToast('Export PDF สำเร็จ');
  } catch(err){ showToast('ไม่สามารถ Export PDF ได้'); console.error(err); } finally { setLoading(false); }
}

function handleExport(type) {
  if (type==='png') exportPNG();
  if (type==='pdf') exportPDF();
  if (type==='print') window.print();
}

function setupScrollSpy() {
  const observer=new IntersectionObserver(entries=>{
    if (presentationMode) return;
    const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    const idx=sectionIds.indexOf(visible.target.id); if(idx<0)return; activeIndex=idx;
    qsa('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.target===visible.target.id));
    qs('#topbarTitle').textContent=visible.target.dataset.title;
    revealActiveSection();
  },{threshold:[.15,.35,.55],rootMargin:'-12% 0px -55% 0px'});
  qsa('.dashboard-section').forEach(s=>observer.observe(s));
}

function init() {
  renderNav(); renderOverview(); renderCurrentDesired(); renderPriority(); renderAreas(); renderSWOT(); renderTOWS(); renderStrategies(); renderEvaluation();
  bindEvents(); setupScrollSpy();
  qsa('.dashboard-section').forEach(s=>s.classList.add('active-section'));
  setTimeout(()=>{ revealActiveSection(); renderCurrentDesiredChart(); renderPriorityChart(); renderEvaluationChart(); },120);
}

document.addEventListener('DOMContentLoaded',init);
