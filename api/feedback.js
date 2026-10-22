// api/feedback.js — Vercel Serverless Function
// 将用户反馈写入飞书多维表格
// 配置：在 Vercel 项目环境变量中设置以下变量：
//   FEISHU_APP_ID      — 飞书应用 App ID
//   FEISHU_APP_SECRET  — 飞书应用 App Secret
//   FEISHU_BASE_TOKEN  — 多维表格 app_token
//   FEISHU_TABLE_ID    — 多维表格 table_id

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { work, content, email, page } = req.body || {};
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const APP_ID = process.env.FEISHU_APP_ID;
  const APP_SECRET = process.env.FEISHU_APP_SECRET;
  const BASE_TOKEN = process.env.FEISHU_BASE_TOKEN;
  const TABLE_ID = process.env.FEISHU_TABLE_ID;

  // 如果未配置飞书凭证，返回成功但记录日志（避免前端报错）
  if (!APP_ID || !APP_SECRET || !BASE_TOKEN || !TABLE_ID) {
    console.log('[Feedback] Feishu not configured, received:', { work, content, email, page });
    return res.status(200).json({ ok: true, message: 'Feedback received (Feishu not configured)' });
  }

  try {
    // 获取 tenant_access_token
    const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })
    });
    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) {
      throw new Error('Failed to get access token: ' + tokenData.msg);
    }
    const token = tokenData.tenant_access_token;

    // 写入多维表格记录
    const recordRes = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fields: {
          '作品': work || '',
          '反馈内容': content,
          '联系邮箱': email || '',
          '来源页面': page || '',
          '提交时间': Date.now()
        }
      })
    });
    const recordData = await recordRes.json();
    if (recordData.code !== 0) {
      throw new Error('Failed to create record: ' + recordData.msg);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[Feedback] Error:', e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
