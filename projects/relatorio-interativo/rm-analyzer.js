(() => {
  "use strict";
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const money=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});
  const months=["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
  const monthNames=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const state={rows:[],movements:[],mapping:{},issues:[],file:"",demo:false};
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toUpperCase();
  const number=v=>{if(typeof v==="number")return Number.isFinite(v)?v:0;let s=String(v??"").trim().replace(/\s|R\$/g,"");if(!s)return 0;if(s.includes(",")&&s.includes("."))s=s.replace(/\./g,"").replace(",",".");else if(s.includes(","))s=s.replace(",",".");const n=Number(s.replace(/[^\d.-]/g,""));return Number.isFinite(n)?n:0};
  function toast(message){const el=$("[data-rm-toast]");el.textContent=message;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,4500)}
  function demoRows(){
    const names=[["Receitas de serviços","Administrativo","Entrada"],["Receitas recorrentes","Operações","Entrada"],["Folha e encargos","Pessoas","Saída"],["Fornecedores","Operações","Saída"],["Infraestrutura","Tecnologia","Saída"],["Tributos","Administrativo","Saída"]];
    return names.map((n,i)=>{const r={NATUREZA:n[0],"CENTRO DE CUSTO":n[1],TIPO:n[2]};months.forEach((m,j)=>r[m]=Math.round((n[2]==="Entrada"?42000:12000)*(1+Math.sin((j+i)*.7)*.18)+(i*970)));return r});
  }
  function parseCsv(text){const lines=text.replace(/^\uFEFF/,"").split(/\r?\n/).filter(Boolean);const delimiter=(lines[0].match(/;/g)||[]).length>(lines[0].match(/,/g)||[]).length?";":",";const split=line=>{let out=[],cur="",quote=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(quote&&line[i+1]==='"'){cur+='"';i++}else quote=!quote}else if(c===delimiter&&!quote){out.push(cur);cur=""}else cur+=c}out.push(cur);return out};const matrix=lines.map(split);return matrixToRows(matrix)}
  function matrixToRows(matrix){const headerIndex=matrix.findIndex(r=>r.some(v=>/natureza|centro.*custo|tipo/i.test(String(v))));if(headerIndex<0)throw new Error("Não encontrei uma linha de cabeçalho com Natureza, Centro de Custo ou Tipo.");const headers=matrix[headerIndex].map((v,i)=>String(v||`COLUNA ${i+1}`).trim());return matrix.slice(headerIndex+1).filter(r=>r.some(v=>String(v).trim())).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??""])))}
  async function readFile(file){if(/\.csv$/i.test(file.name))return parseCsv(await file.text());if(!window.XLSX){await new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";s.onload=resolve;s.onerror=()=>reject(new Error("Não foi possível carregar o leitor de Excel. Converta o arquivo para CSV ou verifique a conexão."));document.head.appendChild(s)})}const data=await file.arrayBuffer(),book=XLSX.read(data);const sheet=book.Sheets[book.SheetNames[0]];return matrixToRows(XLSX.utils.sheet_to_json(sheet,{header:1,defval:""}))}
  function recognize(rows){
    const keys=[...new Set(rows.flatMap(Object.keys))], find=tests=>keys.find(k=>tests.some(t=>t.test(norm(k))));
    const nature=find([/NATUREZA/,/CONTA ORCAMENTARIA/]), cost=find([/CENTRO.*CUSTO/,/CCUSTO/]), type=find([/^TIPO$/, /ENTRADA.*SAIDA/,/RECEITA.*DESPESA/]);
    const monthKeys={};keys.forEach(k=>{const n=norm(k);months.forEach((m,i)=>{if(n.includes(m)||n.includes(norm(monthNames[i])))monthKeys[i]=k})});
    state.mapping={nature,cost,type,monthKeys};state.issues=[];
    if(!nature)state.issues.push(["Natureza não encontrada","É preciso identificar a coluna de natureza orçamentária."]);
    if(!type)state.issues.push(["Tipo não encontrado","Sem a coluna de tipo, entradas e saídas não podem ser separadas com segurança."]);
    if(!Object.keys(monthKeys).length)state.issues.push(["Meses não encontrados","Nenhuma coluna mensal foi reconhecida."]);
    const movements=[];
    rows.forEach((row,rowIndex)=>{const label=String(row[nature]??"").trim();if(!label||/\bTOTAL\b/i.test(label))return;const rawType=norm(row[type]);const kind=/ENTR|RECEI|CRED/.test(rawType)?"income":/SAI|DESP|DEB/.test(rawType)?"expense":"unknown";if(kind==="unknown")state.issues.push([`Tipo não reconhecido na linha ${rowIndex+2}`,String(row[type]||"vazio")]);Object.entries(monthKeys).forEach(([i,key])=>{const value=Math.abs(number(row[key]));if(value)movements.push({month:Number(i),kind,nature:label,cost:String(row[cost]||"Não informado").trim(),value,row:rowIndex+2})})});
    state.movements=movements;
  }
  function metrics(){const valid=state.movements.filter(m=>m.kind!=="unknown"), monthly=months.map((_,i)=>({income:0,expense:0,balance:0}));valid.forEach(m=>monthly[m.month][m.kind]+=m.value);let balance=0;monthly.forEach(m=>{balance+=m.income-m.expense;m.balance=balance});return{monthly,income:valid.filter(m=>m.kind==="income").reduce((a,b)=>a+b.value,0),expense:valid.filter(m=>m.kind==="expense").reduce((a,b)=>a+b.value,0),balance}}
  function chart(data){const w=900,h=260,p=28,max=Math.max(1,...data.flatMap(d=>[d.income,d.expense,Math.abs(d.balance)])),x=i=>p+i*(w-p*2)/11,y=v=>h-p-(Math.max(0,v)/max)*(h-p*2),points=k=>data.map((d,i)=>`${x(i)},${y(k==="balance"?Math.max(0,d[k]):d[k])}`).join(" ");return`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Evolução mensal"><g stroke="var(--line)" stroke-width="1">${[.25,.5,.75].map(q=>`<line x1="${p}" x2="${w-p}" y1="${h*q}" y2="${h*q}"/>`).join("")}</g><polyline fill="none" stroke="var(--green)" stroke-width="3" points="${points("income")}"/><polyline fill="none" stroke="var(--danger)" stroke-width="3" points="${points("expense")}"/><polyline fill="none" stroke="var(--green-2)" stroke-width="4" points="${points("balance")}"/></svg>`}
  function render(){
    const m=metrics(), valid=state.movements.filter(x=>x.kind!=="unknown");
    $("[data-rm-import-screen]").hidden=true;$("[data-rm-workspace]").hidden=false;
    $("[data-rm-file-name]").textContent=state.file;$("[data-rm-context]").textContent=state.demo?"Demonstração · valores fictícios":"Arquivo local · valores importados";
    $("[data-rm-balance]").textContent=money.format(m.balance);$("[data-rm-income]").textContent=money.format(m.income);$("[data-rm-expense]").textContent=money.format(m.expense);
    const active=m.monthly.map((v,i)=>({...v,i})).filter(v=>v.income||v.expense),low=active.reduce((a,b)=>b.balance<a.balance?b:a,active[0]||{balance:0,i:0});
    $("[data-rm-lowest]").textContent=`Menor saldo ${monthNames[low.i]} · ${money.format(low.balance)}`;$("[data-rm-chart]").innerHTML=chart(m.monthly);
    const alerts=[];if(low.balance<0)alerts.push(["Saldo negativo",`${monthNames[low.i]} fecha em ${money.format(low.balance)}.`]);const biggest=m.monthly.map((v,i)=>({...v,i})).sort((a,b)=>b.expense-a.expense)[0];if(biggest?.expense)alerts.push(["Maior volume de saídas",`${monthNames[biggest.i]} concentra ${money.format(biggest.expense)}.`]);if(state.issues.length)alerts.push(["Importação pede revisão",`${state.issues.length} ponto(s) precisam de conferência.`]);if(!alerts.length)alerts.push(["Sem alerta automático","Confira os movimentos antes de usar os totais em decisões."]);
    $("[data-rm-attention]").innerHTML=alerts.map(a=>`<div class="rm-attention-item"><strong>${esc(a[0])}</strong><span>${esc(a[1])}</span></div>`).join("");
    const natures={};valid.filter(x=>x.kind==="expense").forEach(x=>natures[x.nature]=(natures[x.nature]||0)+x.value);
    $("[data-rm-natures]").innerHTML=Object.entries(natures).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([n,v])=>`<button class="rm-nature-item" type="button" data-nature="${esc(n)}"><span>${esc(n)}</span><strong>${money.format(v)}</strong></button>`).join("")||"<p>Nenhuma saída reconhecida.</p>";
    const recognized=Object.keys(state.mapping.monthKeys).length;
    $("[data-rm-check-summary]").innerHTML=`<div><span>Linhas recebidas</span><strong>${state.rows.length}</strong></div><div><span>Movimentos interpretados</span><strong>${valid.length}</strong></div><div><span>Meses reconhecidos</span><strong>${recognized}</strong></div>`;
    $("[data-rm-mapping]").innerHTML=[["Natureza",state.mapping.nature],["Centro de custo",state.mapping.cost],["Tipo",state.mapping.type],["Colunas mensais",Object.values(state.mapping.monthKeys).join(", ")]].map(([a,b])=>`<dt>${a}</dt><dd>${esc(b||"Não reconhecido")}</dd>`).join("");
    $("[data-rm-issues]").innerHTML=state.issues.length?state.issues.map(i=>`<div class="rm-issue"><strong>${esc(i[0])}</strong><span>${esc(i[1])}</span></div>`).join(""):'<div class="rm-issue"><strong>Nenhuma pendência estrutural encontrada</strong><span>Isso não substitui a conferência dos totais com o relatório de origem.</span></div>';
    $("[data-rm-issue-count]").textContent=state.issues.length;renderTable();
    $("[data-rm-report]").innerHTML=`<h2>${esc(state.file)}</h2><p>${state.demo?"Análise demonstrativa com valores fictícios.":"Resumo calculado localmente a partir do arquivo importado."}</p><dl><dt>Entradas</dt><dd>${money.format(m.income)}</dd><dt>Saídas</dt><dd>${money.format(m.expense)}</dd><dt>Saldo final</dt><dd>${money.format(m.balance)}</dd><dt>Movimentos interpretados</dt><dd>${valid.length}</dd><dt>Pendências estruturais</dt><dd>${state.issues.length}</dd></dl><p><strong>Nota de conferência:</strong> compare os totais com a exportação original do TOTVS RM antes de usar este resumo.</p>`;
  }
  function renderTable(filter=""){const q=norm(filter),rows=state.movements.filter(m=>m.kind!=="unknown"&&(!q||norm(`${m.nature} ${m.cost}`).includes(q))).slice(0,1000);$("[data-rm-table]").innerHTML=rows.map(m=>`<tr><td>${monthNames[m.month]}</td><td>${m.kind==="income"?"Entrada":"Saída"}</td><td>${esc(m.nature)}</td><td>${esc(m.cost)}</td><td class="number">${money.format(m.value)}</td></tr>`).join("")||'<tr><td colspan="5">Nenhum movimento encontrado.</td></tr>'}
  async function load(rows,file,demo=false){state.rows=rows;state.file=file;state.demo=demo;recognize(rows);if(!state.mapping.nature||!Object.keys(state.mapping.monthKeys).length){toast("A estrutura não pôde ser analisada. Abra a conferência para ver o motivo.")}render()}
  $("#rm-file")?.addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{toast("Lendo o arquivo…");await load(await readFile(file),file.name)}catch(err){toast(err.message)}});
  $("[data-rm-demo]")?.addEventListener("click",()=>load(demoRows(),"Fluxo RM · demonstração",true));
  $$("[data-rm-view]").forEach(b=>b.addEventListener("click",()=>{$$("[data-rm-view]").forEach(x=>x.classList.toggle("is-active",x===b));$$("[data-rm-panel]").forEach(p=>{const on=p.dataset.rmPanel===b.dataset.rmView;p.hidden=!on;p.classList.toggle("is-active",on)})}));
  $("[data-rm-reset]")?.addEventListener("click",()=>location.reload());$$("[data-rm-print]").forEach(b=>b.addEventListener("click",()=>{const report=$('[data-rm-view="report"]');report?.click();setTimeout(()=>print(),50)}));
  $("[data-rm-search]")?.addEventListener("input",e=>renderTable(e.target.value));document.addEventListener("click",e=>{const b=e.target.closest("[data-nature]");if(b){$('[data-rm-view="movements"]').click();$("[data-rm-search]").value=b.dataset.nature;renderTable(b.dataset.nature)}});
  $("[data-rm-theme]")?.addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("rm-product-theme",next)});
  const stored=localStorage.getItem("rm-product-theme");if(stored)document.documentElement.dataset.theme=stored;
  if(new URLSearchParams(location.search).get("demo")==="1")load(demoRows(),"Fluxo RM · demonstração",true);
})();
