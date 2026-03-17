/**
 * Netlify Function: fetch live Google reviews via Places API (New).
 * Set in Netlify: GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID (your business Place ID, e.g. ChIJ...).
 * Place Details (New) with reviews: https://developers.google.com/maps/documentation/places/web-service/place-details
 */
exports.handler = async function (event, context) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID in Netlify environment',
        reviews: [],
      }),
    };
  }

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const headers = {
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
  };

  try {
    const res = await fetch(url, { headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
        body: JSON.stringify({
          error: data.error?.message || 'Places API error',
          reviews: [],
          averageRating: null,
          reviewCount: null,
        }),
      };
    }

    const rawReviews = data.reviews || [];
    const reviews = rawReviews
      .filter((r) => r.rating >= 4 && (r.text?.text || r.originalText?.text))
      .slice(0, 10)
      .map((r) => {
        const text = r.text?.text || r.originalText?.text || '';
        const author = r.authorAttribution?.displayName || 'Google User';
        return {
          author,
          rating: typeof r.rating === 'number' ? r.rating : 5,
          text,
          date: r.publishTime || null,
          source: 'Google',
        };
      });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
      body: JSON.stringify({
        businessName: data.displayName?.text || 'Seth Notary Services LLC',
        averageRating: data.rating ?? null,
        reviewCount: data.userRatingCount ?? reviews.length,
        reviews,
      }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: err.message || 'Request failed',
        reviews: [],
        averageRating: null,
        reviewCount: null,
      }),
    };
  }
};
