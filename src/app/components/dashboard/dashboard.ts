import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Api } from '../../services/api';
import { GenerateReleaseResponse } from '../../models/vault.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private apiService = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  authService = inject(Auth);

  // Form inputs
  rawGitDiff: string = '';
  releaseTitle: string = '';

  // State management
  isLoading: boolean = false;
  isSaving: boolean = false;
  saveSuccess: boolean = false;

  // AI response storage
  generatedNotes: GenerateReleaseResponse | null = null;  

  // Call the .NET Gemini AI endpoint
  generateNotes(): void {
    if (!this.rawGitDiff.trim()) return;

    this.isLoading = true;
    this.generatedNotes = null;
    this.saveSuccess = false;

    this.apiService.generateReleaseNotes({ rawGitDiff: this.rawGitDiff }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.generatedNotes = response;
        
        if (!this.releaseTitle && response) {
          this.releaseTitle = `Release ${response.semanticVersion} - ${new Date().toLocaleDateString()}`;
        }
        
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Generation failed', err);
        this.isLoading = false;
        
        this.cdr.detectChanges(); 
        
        alert('AI generation failed. Please check backend logs.');
      }
    });
  }

  // Call the .NET PostgreSQL vault endpoint
  saveRelease(): void {
    if (!this.generatedNotes || !this.releaseTitle.trim()) return;

    const currentUserId = this.authService.getUserId();

    if (!currentUserId) {
      alert('Authentication error: Could not find your User ID. Please log out and back in.');
      return;
    }

    this.isSaving = true;

    this.apiService.saveToVault({
      userId: currentUserId, // We pass the real ID here!
      title: this.releaseTitle,
      rawInput: this.rawGitDiff,
      markdownNotes: this.generatedNotes.markdownNotes,
      socialPost: this.generatedNotes.socialPost,
      semanticVersion: this.generatedNotes.semanticVersion
    }).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.saveSuccess = true;
        this.cdr.detectChanges(); 
        
        setTimeout(() => {
          this.generatedNotes = null;
          this.rawGitDiff = '';
          this.releaseTitle = '';
          this.saveSuccess = false;
          this.cdr.detectChanges(); 
        }, 2000);
      },
      error: (err) => {
        console.error('Saving failed', err);
        this.isSaving = false;
        this.cdr.detectChanges(); 
        alert('Failed to save to database vault.');
      }
    });
  }
}
