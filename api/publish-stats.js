export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const stats = req.body;
  const token = process.env.GITHUB_TOKEN;
  const repo = 'magicludor/fabulor';
  const path = 'stats.json';

  try {
    // Get current file SHA (needed to update)
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'fabulor' }
    });
    const getSha = getRes.ok ? (await getRes.json()).sha : null;

    // Write new stats
    const content = Buffer.from(JSON.stringify(stats, null, 2)).toString('base64');
    await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'fabulor', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Update stats', content, ...(getSha ? { sha: getSha } : {}) })
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: true, message: e.message });
  }
}
