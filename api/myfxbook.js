export default async function handler(req, res) {
  const { action, email, password, session } = req.query;
  const BASE = 'https://www.myfxbook.com/api';

  try {
    let url;
    if (action === 'login') {
      url = `${BASE}/login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    } else if (action === 'accounts') {
      url = `${BASE}/get-my-accounts.json?session=${session}`;
    } else if (action === 'logout') {
      url = `${BASE}/logout.json?session=${session}`;
    } else {
      return res.status(400).json({ error: true, message: 'Action inconnue' });
    }

    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: true, message: e.message });
  }
}
