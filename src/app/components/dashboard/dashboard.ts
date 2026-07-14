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
  errorMessage: string | null = null; 

  // AI response storage
  generatedNotes: GenerateReleaseResponse | null = null;  

  // Call the .NET Gemini AI endpoint
  generateNotes(): void {
    if (!this.rawGitDiff.trim()) return;

    this.isLoading = true;
    this.generatedNotes = null;
    this.saveSuccess = false;
    this.errorMessage = null; // Clear any previous errors when starting a new request

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
        
        // 1. Set a highly professional error message based on the HTTP status code
        if (err.status === 503 || err.status === 504 || err.status === 500) {
          this.errorMessage = 'The AI Engine is currently experiencing high traffic or is temporarily unavailable. Please try again in a few moments.';
        } else if (err.status === 400) {
          this.errorMessage = 'The AI could not process this input. Please ensure you are providing a valid code diff or commit log.';
        } else {
          this.errorMessage = 'An unexpected connection error occurred. Please verify your network and try again.';
        }
        
        this.cdr.detectChanges(); 

        // 2. Toast Simulation: Auto-hide the error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = null;
          this.cdr.detectChanges();
        }, 5000);
      }
    });
  }

  // Call the .NET PostgreSQL vault endpoint
  saveRelease(): void {
    if (!this.generatedNotes || !this.releaseTitle.trim()) return;

    const currentUserId = this.authService.getUserId();

    if (!currentUserId) {
      // 1. Show auth error in the toast instead of an alert
      this.errorMessage = 'Authentication error: Could not find your User ID. Please log out and back in.';
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.errorMessage = null;
        this.cdr.detectChanges();
      }, 5000);
      return;
    }

    this.isSaving = true;
    this.errorMessage = null; // Clear any existing errors

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
        
        // Success already has visual feedback on the button itself!
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
        
        // 2. Show API save error in the toast instead of an alert
        this.errorMessage = 'Failed to save to the database vault. Please check your connection and try again.';
        this.cdr.detectChanges(); 
        
        setTimeout(() => {
          this.errorMessage = null;
          this.cdr.detectChanges();
        }, 5000);
      }
    });
  }
}
