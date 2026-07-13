import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private tokenKey = 'devvault_jwt';

  // 1. Save the token to the browser
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // 2. Retrieve the token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 3. Destroy the token (Logout)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // 4. Check if user is logged in
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // 5. Decode the JWT to get the user's GitHub Name
  getUsername(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      // JWTs have 3 parts separated by dots. The middle part is the data payload.
      const payload = token.split('.')[1]; 
      const decodedJson = atob(payload); // Decodes base64 string
      const claims = JSON.parse(decodedJson);
      return claims.username || 'Developer';
    } catch (e) {
      return 'Developer';
    }
  }

  // 6. Decode the JWT to get the user's unique ID
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1]; 
      const decodedJson = atob(payload);
      const claims = JSON.parse(decodedJson);
      
      // Look for the ID under the most common .NET claim names
      return claims.id || 
             claims.userId || 
             claims.sub || 
             claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
             null;
             
    } catch (e) {
      console.error('Error decoding JWT for User ID', e);
      return null;
    }
  }
}
