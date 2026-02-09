export default async function handler(req, res) {
  try {
    const key = process.env.OPENWEATHER_KEY;
    if (!key) {
      return res.status(500).json({ error: "Missing OPENWEATHER_KEY env var" });
    }

    const { q, lat, lon } = req.query;

    const url = new URL("https://api.openweathermap.org/data/2.5/weather");

    if (q) url.searchParams.set("q", q);
    if (lat && lon) {
      url.searchParams.set("lat", lat);
      url.searchParams.set("lon", lon);
    }

    url.searchParams.set("appid", key);
    url.searchParams.set("lang", "fr");
    url.searchParams.set("units", "metric");

    const r = await fetch(url.toString());
    const text = await r.text();

    // Renvoie tel quel (et garde le code HTTP)
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}
