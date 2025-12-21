import{_ as h}from"./Dp1pzeXC.js";const b={format:"A4",margin:{top:"20mm",bottom:"20mm",left:"15mm",right:"15mm"},printBackground:!0,displayHeaderFooter:!1,landscape:!1,scale:1};function g(l){const n=document.createElement("div");n.innerHTML=l;const t=[];return n.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((e,s)=>{var m;const a=parseInt(e.tagName.charAt(1)),i=((m=e.textContent)==null?void 0:m.trim())||"";let r=e.id;r||(r=`heading-${s+1}`,e.id=r),i&&t.push({id:r,text:i,level:a,originalTag:e.tagName.toLowerCase()})}),n.innerHTML="",t}function x(l,n="Inhaltsverzeichnis"){if(l.length===0)return"";let t=`<div class="table-of-contents">
    <h2 class="toc-title">${n}</h2>
    <nav class="toc-nav">`,o=0;l.forEach((e,s)=>{if(e.level>o)for(let i=o;i<e.level;i++)t+='<ul class="toc-list">';else if(e.level<o)for(let i=e.level;i<o;i++)t+="</ul>";const a=e.pageNumber!==void 0?e.pageNumber.toString():"...";t+=`<li class="toc-item toc-level-${e.level}">
      <a href="#${e.id}" class="toc-link">
        <span class="toc-text">${e.text}</span>
        <span class="toc-dots"></span>
        <span class="toc-page-number">${a}</span>
      </a>
    </li>`,o=e.level});for(let e=0;e<o;e++)t+="</ul>";return t+="</nav></div>",t}function v(){const l=[];for(const n of Array.from(document.styleSheets))try{const t=n.cssRules||n.rules;t&&Array.from(t).forEach(o=>o.cssText&&l.push(o.cssText))}catch{n.href&&l.push(`@import url("${n.href}");`)}return document.querySelectorAll("style").forEach(n=>n.textContent&&l.push(n.textContent)),l.join(`
`)}async function y(l,n={}){const t=document.createElement("div");t.style.position="absolute",t.style.left="-9999px",t.style.top="-9999px",t.style.visibility="hidden",document.body.appendChild(t);try{const{mount:o,unmount:e}=await h(async()=>{const{mount:c,unmount:u}=await import("./BdERSUDM.js").then(f=>f.bg);return{mount:c,unmount:u}},[],import.meta.url);await document.fonts.ready;const s=o(l,{target:t,props:n});await new Promise(c=>setTimeout(c,100));let a="",i=0;const r=20;for(let c=0;c<r;c++){const u=t.innerHTML;if(u===a){if(i++,i>=3)break}else i=0;a=u,await new Promise(f=>setTimeout(f,200))}const m=t.querySelectorAll("img");m.length>0&&await Promise.all(Array.from(m).map(c=>c.complete?Promise.resolve():new Promise(u=>{c.addEventListener("load",u),c.addEventListener("error",u),setTimeout(u,3e3)})));const p=t.innerHTML;if(e(s),!p.trim())throw new Error("Component rendered empty HTML");const d=v();return{html:p,styles:d}}finally{t.remove()}}async function T(l){const n=[];let t="",o="";for(const[e,s]of l.entries()){const{component:a,props:i={},title:r=`Page ${e+1}`}=s,{html:m,styles:p}=await y(a,i),d=r?`<div class="pdf-page">
           <h1 class="page-title" id="page-${e+1}">${r}</h1>
           ${m}
         </div>`:`<div class="pdf-page" id="page-${e+1}">${m}</div>`;n.push({title:r,html:d}),t+=d,e===0&&(o=p)}return{html:t,styles:o,pageInfo:n}}function w(l){const n=window.location.origin;let t=l.replace(/url\(['"]?\/(fonts\/[^'"()]+)['"]?\)/g,`url('${n}/$1')`);return t+=`
    /* Fallback font rules for PDF generation */
    body, html, * {
      font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    }
  `,t}function E(l,n,t="Report",o={}){const e=o.calculationReportSubtitle||"Berechnungsbericht",s=w(n);let a=l,i="";if(o.includeTableOfContents){const r=o.customTocEntries||g(l);if(r.length>0&&(i=x(r,o.tocTitle),!o.customTocEntries)){const m=document.createElement("div");m.innerHTML=l,r.forEach(p=>{const d=m.querySelector(`#${p.id}`);d&&!d.id&&(d.id=p.id)}),a=m.innerHTML}}return`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>${t}</title>
  <style>
    ${s}
    html, body { margin:0; padding:0; width:100%; background:white; }
    .pdf-header { text-align:center; margin-bottom:20px; }
    .pdf-content { width:100%; margin:8px; }
    button { display:none; }

    .table-of-contents {
      margin: 30px 0;
      padding: 20px 0;
      page-break-after: always;
    }

    .toc-title {
      margin: 0 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #333;
      font-size: 1.5em;
      color: #333;
    }

    .toc-nav {
      margin: 0;
    }

    .toc-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .toc-item {
      margin: 8px 0;
      line-height: 1.4;
    }

    .toc-link {
      display: flex;
      text-decoration: none;
      color: #333;
      padding: 4px 0;
      align-items: baseline;
    }

    .toc-link:hover {
      color: #0066cc;
    }

    .toc-text {
      flex-shrink: 0;
      margin-right: 8px;
    }

    .toc-dots {
      flex-grow: 1;
      border-bottom: 1px dotted #666;
      margin: 0 8px;
      height: 1px;
      margin-bottom: 4px;
    }

    .toc-page-number {
      flex-shrink: 0;
      font-style: italic;
      color: #666;
      min-width: 30px;
      text-align: right;
      font-weight: 500;
    }

    .toc-level-1 { margin-left: 0; }
    .toc-level-2 { margin-left: 20px; }
    .toc-level-3 { margin-left: 40px; }
    .toc-level-4 { margin-left: 60px; }
    .toc-level-5 { margin-left: 80px; }
    .toc-level-6 { margin-left: 100px; }

    .toc-level-2 .toc-text { font-size: 0.95em; }
    .toc-level-3 .toc-text { font-size: 0.9em; }
    .toc-level-4 .toc-text { font-size: 0.85em; }
    .toc-level-5 .toc-text { font-size: 0.8em; }
    .toc-level-6 .toc-text { font-size: 0.75em; }

    .pdf-page {
      page-break-before: always;
      margin-bottom: 30px;
      width: 100%;
    }

    .pdf-page:first-child {
      page-break-before: auto;
    }

    .page-title {
      margin-top: 0;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #333;
      color: #333;
      font-size: 1.8em;
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    ${o.headerHTML||`<h1>${t}</h1>
    <p>${e}</p>
    <p>Generiert am: ${new Date().toLocaleString("de-DE")}</p>`}
  </div>
  ${i}
  <div class="pdf-content">${a}</div>
</body>
</html>`}async function $(l,n={},t="report.pdf"){let o;o="https://elastotool-pdf-server-126717118048.europe-west3.run.app";const e=await fetch(`${o}/generate-pdf`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({html:l,options:{...b,...n}})});if(!e.ok){const a=await e.text();throw new Error(`PDF generation failed: ${e.statusText} - ${a}`)}const s=await e.blob();if(!s.size)throw new Error("PDF returned empty file");return s}function L(l,n){const t=URL.createObjectURL(l),o=document.createElement("a");o.href=t,o.download=n,document.body.appendChild(o),o.click(),URL.revokeObjectURL(t),o.remove()}function P(l,n,t="Brückenlager-Eingabeparameter",o="Berechnete Elastomer-Parameter"){const e=[];return l.forEach((s,a)=>{var p,d;const i=n[a],r=a+2;e.push({id:`page-${a+1}`,text:s.title||`Component ${a+1}`,level:1,originalTag:"h1",pageNumber:r}),(s.component.name==="PDFElastoParams"||(p=s.title)!=null&&p.includes("Elastomer-Parameter")||(d=s.title)!=null&&d.includes("Elastomer Parameters"))&&(e.push({id:"input-params",text:t,level:2,originalTag:"h3",pageNumber:r}),e.push({id:"calculated-params",text:o,level:2,originalTag:"h3",pageNumber:r})),g(i.html).forEach(c=>{c.level>1&&c.id!=="input-params"&&c.id!=="calculated-params"&&e.push({id:`page-${a+1}-${c.id}`,text:c.text,level:Math.min(c.level+1,6),originalTag:c.originalTag,pageNumber:r})})}),e}async function C(l,n="multi-report",t={},o="statiqs Multi-Component Report",e){const{html:s,styles:a,pageInfo:i}=await T(l);let r;t.includeTableOfContents&&(r=P(l,i,t.inputParamsSectionTitle,t.calculatedParamsSectionTitle));const m=E(s,a,o,{includeTableOfContents:t.includeTableOfContents,tocTitle:t.tocTitle||"Inhaltsverzeichnis",customTocEntries:r,headerHTML:e,calculationReportSubtitle:t.calculationReportSubtitle}),p=await $(m,t,`${n}.pdf`);L(p,`${n}.pdf`)}export{C as c};
