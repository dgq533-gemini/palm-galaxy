/* i18n.js — 作品集通用中英文方案
 * 用法：
 *   1. <script src="i18n.js"></script>
 *   2. i18n.setDict({ zh:{key:'中文'}, en:{key:'English'} })
 *   3. 静态文本加 data-i18n="key"，占位符加 data-i18n-placeholder
 *   4. 动态文本用 i18n.t('key')
 *   5. 监听 document 'langchange' 事件重新渲染
 */
(function(){
  const STORAGE_KEY='code-cosmos-lang';
  function detect(){
    const s=localStorage.getItem(STORAGE_KEY);
    if(s==='zh'||s==='en')return s;
    return (navigator.language||'en').toLowerCase().startsWith('zh')?'zh':'en';
  }
  let lang=detect();
  let D={zh:{},en:{}};
  function t(k){return(D[lang][k]!==undefined?D[lang][k]:D.zh[k])||k}
  function apply(){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(e=>{e.textContent=t(e.getAttribute('data-i18n'))});
    document.querySelectorAll('[data-i18n-placeholder]').forEach(e=>{e.placeholder=t(e.getAttribute('data-i18n-placeholder'))});
    document.querySelectorAll('[data-i18n-title]').forEach(e=>{e.title=t(e.getAttribute('data-i18n-title'))});
    const tb=document.getElementById('i18n-toggle');
    if(tb)tb.textContent=lang==='zh'?'EN':'中';
    document.dispatchEvent(new CustomEvent('langchange',{detail:{lang}}));
  }
  function setLang(l){lang=l;localStorage.setItem(STORAGE_KEY,l);apply()}
  function setDict(d){D=d;apply()}
  function inject(){
    if(document.getElementById('i18n-toggle'))return;
    const b=document.createElement('button');
    b.id='i18n-toggle';
    b.textContent=lang==='zh'?'EN':'中';
    b.style.cssText='position:fixed;top:16px;right:16px;z-index:99999;background:rgba(10,20,30,.85);color:#56e9df;border:1px solid rgba(86,233,223,.4);border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(8px);letter-spacing:.05em;font-family:"Microsoft YaHei",sans-serif;transition:all .2s';
    b.onmouseenter=()=>{b.style.background='rgba(86,233,223,.15)';b.style.borderColor='#56e9df'};
    b.onmouseleave=()=>{b.style.background='rgba(10,20,30,.85)';b.style.borderColor='rgba(86,233,223,.4)'};
    b.onclick=()=>{setLang(lang==='zh'?'en':'zh')};
    document.body.appendChild(b);
  }
  window.i18n={t,setLang,setDict,apply,get lang(){return lang}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{inject();apply()});
  else{inject();apply()}
})();
