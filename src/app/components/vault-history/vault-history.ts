import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { SavedRelease } from '../../models/vault.model'; // Make sure this model exists!
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vault-history',
  imports: [CommonModule, RouterModule],
  templateUrl: './vault-history.html',
  styleUrl: './vault-history.scss',
})
export class VaultHistory implements OnInit {
  private apiService = inject(Api);
  private cdr = inject(ChangeDetectorRef);

  // 1. Hold the full list of records returned by the backend
  records: SavedRelease[] = [];
  
  // 2. The currently selected record for the right pane
  selectedRecord: SavedRelease | null = null;

  // 3. Single loading state
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadHistoryTimeline();
  }

  loadHistoryTimeline(): void {
    this.isLoading = true;
    
    // Call the new Auth-protected endpoint (Notice: NO User ID parameter needed!)
    this.apiService.getHistory().subscribe({
      next: (data) => {
        console.log('🚨 API Response Data:', data);
        this.records = data;
        this.isLoading = false;
        
        // Auto-select the very first release item so the right pane isn't empty
        if (data.length > 0) {
          this.selectedRecord = data[0];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load vault timeline', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Fires instantly when a user clicks an item in the left sidebar
  // No secondary API call needed because the data is already in memory!
  selectRecord(record: SavedRelease): void {
    this.selectedRecord = record;
  }
}