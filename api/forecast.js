export default async function handler(req, res) {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Missing lat/lon" });

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", lon);

    // 24h + 7 jours
    url.searchParams.set("hourly", "temperature_2m");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("daily", "temperature_2m_min,temperature_2m_max,weathercode");
    url.searchParams.set("timezone", "auto");

    const r = await fetch(url.toString());
    const text = await r.text();
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}
