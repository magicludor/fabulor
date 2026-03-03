exports.handler = async function(event) {
  const https = require('https');
  const params = event.queryStringParameters || {};
  const action = params.action;

  const mfxCall = (path) => new Promise((resolve, reject) => {
    https.get('https://www.myfxbook.com/api/' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('JSON invalide')); }
      });
    }).on('error', reject);
  });

  try {
    if(action === 'login') {
      const { email, password } = params;
      if(!email || !password) return { statusCode: 400, body: JSON.stringify({ error: true, message: 'Email et mot de passe requis' }) };
      const data = await mfxCall(`login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) };
    }

    if(action === 'accounts') {
      const { session } = params;
      if(!session) return { statusCode: 400, body: JSON.stringify({ error: true, message: 'Session requise' }) };
      const data = await mfxCall(`get-my-accounts.json?session=${session}`);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) };
    }

    if(action === 'logout') {
      const { session } = params;
      if(session) await mfxCall(`logout.json?session=${session}`);
      return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: false }) };
    }

    return { statusCode: 400, body: JSON.stringify({ error: true, message: 'Action inconnue' }) };

  } catch(e) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: true, message: e.message }) };
  }
};
