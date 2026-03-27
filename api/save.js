export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();

  const { JSONBIN_API_KEY, JSONBIN_BIN_ID } = process.env;
  if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(req.body)
    });
    if (!r.ok) throw new Error(`JSONBin ${r.status}`);
    const json = await r.json();
    res.status(200).json({ ok: true, version: json.metadata?.version });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
