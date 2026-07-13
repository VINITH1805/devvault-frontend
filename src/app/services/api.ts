import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GenerateReleaseRequest, GenerateReleaseResponse, SavedRelease, SaveReleaseRequest, VaultHistorySummary } from '../models/vault.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  
  // Update this port to match your running .NET API port
  private apiUrl = environment.apiUrl;

  // 1. Send raw git diff to the Gemini AI Brain
  generateReleaseNotes(request: GenerateReleaseRequest): Observable<GenerateReleaseResponse> {
    return this.http.post<GenerateReleaseResponse>(`${this.apiUrl}/generate`, request);
  }

  // 2. Save a generated release note to the PostgreSQL cloud vault
  saveToVault(request: SaveReleaseRequest): Observable<SavedRelease> {
    return this.http.post<SavedRelease>(`${this.apiUrl}/vault`, request);
  }

  // 3. Fetch the brief history list for a specific developer
  // Add this inside your Api service class
  getHistory() {
    // Because of our Interceptor, the JWT token is attached automatically!
    return this.http.get<any[]>(`${this.apiUrl}/vault/history`);
  }

  // 4. Fetch the full detailed view of a single historical release
  getReleaseDetail(id: string): Observable<SavedRelease> {
    return this.http.get<SavedRelease>(`${this.apiUrl}/vault/${id}`);
  }
}
