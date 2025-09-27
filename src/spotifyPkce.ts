import fetch from 'node-fetch';

/**
 * Refreshes an expired access token using OAuth 2.0 PKCE refresh token flow.
 * Used to get a new access token without requiring user re-authorization.
 * 
 * @param clientId - Your Spotify app's client ID
 * @param refreshToken - The refresh token obtained during initial user authorization
 * @returns Promise that resolves to the new access token string
 * @throws Error if the refresh request fails
 */
export async function refreshWithPKCE(clientId: string, refreshToken: string) {
  // Make POST request to Spotify's token endpoint
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    
    // Standard content type for OAuth token requests
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    
    body: new URLSearchParams({
      // Specify refresh token grant type
      grant_type: 'refresh_token',
      
      // The existing refresh token to exchange for new access token
      refresh_token: refreshToken,
      
      // Client ID in body (PKCE doesn't require client secret)
      client_id: clientId,
    })
  });

  // Check if request was successful
  if (!resp.ok) throw new Error(`Refresh error: ${resp.status} ${await resp.text()}`);
  
  // Parse response and extract new access token
  // Type the expected response structure from Spotify's refresh endpoint
  const json = (await resp.json()) as { access_token: string; token_type: string; expires_in: number };
  return json.access_token;
}