/* site.js — 作品集全站通用组件
 * 功能：回主页按钮、反馈弹窗、统一站点标识
 * 用法：<script src="site.js"></script>
 * 反馈提交到 /api/feedback（Vercel Serverless Function）
 */
(function(){
  const SITE_NAME='Alepha';
  const HOME_URL='index.html';
  const FEEDBACK_API='/api/feedback';

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

  // 反馈按钮
  const fbBtn=document.createElement('button');
  fbBtn.id='feedback-btn';
  fbBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><span data-feedback-i18n="fbBtn">反馈</span>';
  fbBtn.style.cssText='position:fixed;bottom:16px;right:16px;z-index:99998;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#56e9df,#4ecdc4);color:#06121a;border:none;border-radius:999px;padding:10px 18px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(86,233,223,.35);transition:all .2s;font-family:"Microsoft YaHei",sans-serif';
  fbBtn.querySelector('svg').style.cssText='width:18px;height:18px';
  fbBtn.onmouseenter=()=>{fbBtn.style.transform='translateY(-2px)';fbBtn.style.boxShadow='0 6px 28px rgba(86,233,223,.5)'};
  fbBtn.onmouseleave=()=>{fbBtn.style.transform='';fbBtn.style.boxShadow='0 4px 20px rgba(86,233,223,.35)'};
  document.body.appendChild(fbBtn);

  // 反馈弹窗
  const overlay=document.createElement('div');
  overlay.id='feedback-overlay';
  overlay.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(3,7,13,.85);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML=`
    <div style="background:linear-gradient(160deg,#0c1a22,#09131d);border:1px solid #1c3340;border-radius:20px;padding:36px;max-width:440px;width:100%;box-shadow:0 30px 80px rgba(0,0,0,.6);position:relative">
      <button id="fb-close" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#7a98a0;font-size:24px;cursor:pointer;line-height:1">×</button>
      <h3 style="color:#eef7f5;font-size:24px;margin:0 0 6px;font-family:'Microsoft YaHei',sans-serif" data-feedback-i18n="fbTitle">给 Alepha 留言</h3>
      <p style="color:#7a98a0;font-size:14px;margin:0 0 24px;font-family:'Microsoft YaHei',sans-serif" data-feedback-i18n="fbSub">你的建议会让星河更亮 ✦</p>
      <div style="margin-bottom:16px">
        <label style="display:block;color:#9bb0b8;font-size:13px;margin-bottom:8px;font-family:'Microsoft YaHei',sans-serif" data-feedback-i18n="fbWork">作品</label>
        <input id="fb-work" readonly style="width:100%;background:#0a1620;border:1px solid #1c3340;border-radius:10px;padding:10px 14px;color:#eef7f5;font-size:14px;font-family:'Microsoft YaHei',sans-serif;box-sizing:border-box">
      </div>
      <div style="margin-bottom:16px">
        <label style="display:block;color:#9bb0b8;font-size:13px;margin-bottom:8px;font-family:'Microsoft YaHei',sans-serif" data-feedback-i18n="fbContent">反馈内容</label>
        <textarea id="fb-content" rows="5" placeholder="..." style="width:100%;background:#0a1620;border:1px solid #1c3340;border-radius:10px;padding:12px 14px;color:#eef7f5;font-size:14px;font-family:'Microsoft YaHei',sans-serif;resize:vertical;box-sizing:border-box" data-feedback-i18n-placeholder="fbContentPh"></textarea>
      </div>
      <div style="margin-bottom:20px">
        <label style="display:block;color:#9bb0b8;font-size:13px;margin-bottom:8px;font-family:'Microsoft YaHei',sans-serif" data-feedback-i18n="fbEmail">邮箱（选填）</label>
        <input id="fb-email" type="email" placeholder="..." style="width:100%;background:#0a1620;border:1px solid #1c3340;border-radius:10px;padding:10px 14px;color:#eef7f5;font-size:14px;font-family:'Microsoft YaHei',sans-serif;box-sizing:border-box" data-feedback-i18n-placeholder="fbEmailPh">
      </div>
      <button id="fb-submit" style="width:100%;background:linear-gradient(135deg,#56e9df,#4ecdc4);color:#06121a;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Microsoft YaHei',sans-serif" data-feedback-i18n="fbSubmit">提交反馈</button>
      <p id="fb-msg" style="text-align:center;margin:12px 0 0;font-size:13px;font-family:'Microsoft YaHei',sans-serif;display:none"></p>
    </div>`;
  document.body.appendChild(overlay);

  const FB_DICT={
    zh:{fbBtn:'反馈',fbTitle:'给 Alepha 留言',fbSub:'你的建议会让星河更亮 ✦',fbWork:'作品',fbContent:'反馈内容',fbContentPh:'说说你的想法、遇到的问题或期待的功能…',fbEmail:'邮箱（选填）',fbEmailPh:'方便我们回复你',fbSubmit:'提交反馈',fbSending:'提交中…',fbSuccess:'感谢你的反馈！已收到 ✦',fbFail:'提交失败，请稍后重试'},
    en:{fbBtn:'Feedback',fbTitle:'Leave a message for Alepha',fbSub:'Your suggestions make the galaxy brighter ✦',fbWork:'Work',fbContent:'Feedback',fbContentPh:'Share your thoughts, issues, or feature requests…',fbEmail:'Email (optional)',fbEmailPh:'So we can get back to you',fbSubmit:'Submit',fbSending:'Sending…',fbSuccess:'Thanks for your feedback! Received ✦',fbFail:'Failed to submit, please try again'}
  };

  function applyFbI18n(){
    const L=(window.i18n&&i18n.lang)||(navigator.language.startsWith('zh')?'zh':'en');
    overlay.querySelectorAll('[data-feedback-i18n]').forEach(e=>e.textContent=FB_DICT[L][e.getAttribute('data-feedback-i18n')]||e.textContent);
    overlay.querySelectorAll('[data-feedback-i18n-placeholder]').forEach(e=>e.placeholder=FB_DICT[L][e.getAttribute('data-feedback-i18n-placeholder')]||e.placeholder);
    fbBtn.querySelector('span').textContent=FB_DICT[L].fbBtn;
  }
  applyFbI18n();
  if(window.i18n)document.addEventListener('langchange',applyFbI18n);

  // 当前作品名
  const workMap={'galaxy.html':'掌中星河 Palm Galaxy','yugang.html':'雨港2077 Rainy Harbor 2077','yinizhiming261021.html':'以你之名的宇宙 Universe of You'};
  const page=location.pathname.split('/').pop()||'index.html';
  document.getElementById('fb-work').value=workMap[page]||'首页 Home';

  fbBtn.onclick=()=>{overlay.style.display='flex'};
  document.getElementById('fb-close').onclick=()=>{overlay.style.display='none'};
  overlay.onclick=e=>{if(e.target===overlay)overlay.style.display='none'};

  document.getElementById('fb-submit').onclick=async()=>{
    const content=document.getElementById('fb-content').value.trim();
    const email=document.getElementById('fb-email').value.trim();
    const work=document.getElementById('fb-work').value;
    const msg=document.getElementById('fb-msg');
    const btn=document.getElementById('fb-submit');
    const L=(window.i18n&&i18n.lang)||'zh';
    if(!content){msg.style.display='block';msg.style.color='#ff6b6b';msg.textContent=L==='zh'?'请填写反馈内容':'Please enter feedback';return}
    btn.disabled=true;btn.textContent=FB_DICT[L].fbSending;
    try{
      const res=await fetch(FEEDBACK_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({work,content,email,page})});
      if(res.ok){msg.style.display='block';msg.style.color='#56e9df';msg.textContent=FB_DICT[L].fbSuccess;document.getElementById('fb-content').value='';document.getElementById('fb-email').value='';setTimeout(()=>{overlay.style.display='none';msg.style.display='none'},2500)}
      else throw new Error('fail')
    }catch(e){msg.style.display='block';msg.style.color='#ff6b6b';msg.textContent=FB_DICT[L].fbFail}
    btn.disabled=false;btn.textContent=FB_DICT[L].fbSubmit;
  };

  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.style.display==='flex')overlay.style.display='none'});
})();
