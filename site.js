/* site.js — 作品集全站通用组件
 * 功能：回主页按钮、反馈入口（跳转飞书公开表单）
 * 用法：<script src="site.js"></script>
 * 反馈方案：点击「反馈」按钮跳转到飞书公开表单，零后端、匿名填写、直接入库
 */
(function(){
  const SITE_NAME='Alepha';
  const HOME_URL='index.html';
  // 飞书公开表单链接 — 用户创建后替换
  const FEISHU_FORM_URL=''; // 例: 'https://xxx.feishu.cn/share/base/form/xxxxxx'

  // 回主页按钮（首页不显示）
  if(!location.pathname.endsWith(HOME_URL)&&location.pathname!=='/'&&location.pathname!==''){
    const home=document.createElement('a');
    home.id='site-home';
    home.href=HOME_URL;
    home.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg><span>'+SITE_NAME+'</span>';
    home.style.cssText='position:fixed;top:14px;left:14px;z-index:99998;display:flex;align-items:center;gap:6px;background:rgba(8,16,24,.82);color:#eef7f5;border:1px solid rgba(86,233,223,.35);border-radius:999px;padding:6px 12px;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:.03em;backdrop-filter:blur(8px);transition:all .2s;font-family:"Microsoft YaHei",sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.4)';
    home.querySelector('svg').style.cssText='width:16px;height:16px;color:#56e9df';
    home.onmouseenter=()=>{home.style.background='rgba(86,233,223,.15)';home.style.borderColor='#56e9df'};
    home.onmouseleave=()=>{home.style.background='rgba(10,20,30,.85)';home.style.borderColor='rgba(86,233,223,.3)'};
    document.body.appendChild(home);
  }

  // 反馈按钮 — 跳转到飞书公开表单
  const fbBtn=document.createElement('a');
  fbBtn.id='feedback-btn';
  fbBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><span data-feedback-i18n="fbBtn">反馈</span>';
  fbBtn.style.cssText='position:fixed;bottom:16px;right:16px;z-index:99998;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#56e9df,#4ecdc4);color:#06121a;border:none;border-radius:999px;padding:10px 18px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(86,233,223,.35);transition:all .2s;font-family:"Microsoft YaHei",sans-serif;text-decoration:none';
  fbBtn.querySelector('svg').style.cssText='width:18px;height:18px';
  fbBtn.onmouseenter=()=>{fbBtn.style.transform='translateY(-2px)';fbBtn.style.boxShadow='0 6px 28px rgba(86,233,223,.5)'};
  fbBtn.onmouseleave=()=>{fbBtn.style.transform='';fbBtn.style.boxShadow='0 4px 20px rgba(86,233,223,.35)'};
  document.body.appendChild(fbBtn);

  function applyFbI18n(){
    const L=(window.i18n&&i18n.lang)||(navigator.language.startsWith('zh')?'zh':'en');
    fbBtn.querySelector('span').textContent=L==='zh'?'反馈':'Feedback';
  }
  applyFbI18n();
  if(window.i18n)document.addEventListener('langchange',applyFbI18n);

  // 点击反馈按钮：跳转飞书公开表单（新窗口）
  fbBtn.addEventListener('click',function(e){
    if(FEISHU_FORM_URL){
      e.preventDefault();
      window.open(FEISHU_FORM_URL,'_blank','noopener,noreferrer');
    }else{
      // 未配置表单时提示
      e.preventDefault();
      const L=(window.i18n&&i18n.lang)||'zh';
      alert(L==='zh'?'反馈功能即将上线，敬请期待！':'Feedback coming soon!');
    }
  });
})();
