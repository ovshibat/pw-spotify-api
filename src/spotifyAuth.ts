import fetch from 'node-fetch';

export async function getClientCredentialsToken(clientId: string, clientSecret: string) {
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' })
  });
  // Check if the request was successful
  if (!resp.ok) {
    // If failed, throw error with status code and response details
    throw new Error(`Token error: ${resp.status} ${await resp.text()}`);
  }

  // Parse JSON response and extract the access_token field
  // Define the expected response structure from Spotify's token endpoint
  const tokenResponse = (await resp.json()) as { access_token: string; token_type: string; expires_in: number };
  
  return tokenResponse.access_token;
}