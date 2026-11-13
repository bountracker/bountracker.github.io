export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, description, category } = req.body || {};

  if (!title || !description) {
    return res.status(400).json({ error: 'Başlık ve açıklama zorunludur.' });
  }

  const GITHUB_REPO_OWNER = 'bountracker';
  const GITHUB_REPO_NAME = 'bountracker.github.iobountracker.github.io';
  const TOKEN = process.env.GITHUB_PAT;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Antigravity-App'
        },
        body: JSON.stringify({
          title: `[${category || 'Geri Bildirim'}] ${title}`,
          body: `### Kategori: ${category}\n\n**Açıklama:**\n${description}\n\n---\n*Bu bildirim web arayüzünden doğrudan gönderildi.*`
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.message });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, url: data.html_url });
  } catch (error) {
    return res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
}
