export default async function handler(req, res) {
  try {
    const key = process.env.OPENWEATHER_KEY;
    if (!key) return res.status(500).json({ error: "Missing OPENWEATHER_KEY env var" });

    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Missing lat/lon" });

    // One Call 3.0 (souvent requis pour daily+hourly)
    // Docs: https://openweathermap.org/api/one-call-3
    const url = new URL("https://api.openweathermap.org/data/3.0/onecall");
    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
    url.searchParams.set("appid", key);
    url.searchParams.set("units", "metric");
    url.searchParams.set("lang", "fr");
    url.searchParams.set("exclude", "minutely,alerts"); // on garde current+hourly+daily

    const r = await fetch(url.toString());
    const text = await r.text();
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}
