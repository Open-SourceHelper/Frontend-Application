import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { ClinicalGuidelineStore } from '../../../application/clinical-guideline.store';

@Component({
  selector: 'app-clinical-guideline-list',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './clinical-guideline-list.html',
  styleUrl: './clinical-guideline-list.css'
})
export class ClinicalGuidelineList implements OnInit {
  readonly store = inject(ClinicalGuidelineStore);

  ngOnInit(): void {
    this.store.loadGuidelines();
  }
}
