import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { PracticalGuideStore } from '../../../application/practical-guide.store';
import { GuideCategory } from '../../../domain/model/guide-category';

@Component({
  selector: 'app-practical-guide-list',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './practical-guide-list.html',
  styleUrl: './practical-guide-list.css'
})
export class PracticalGuideList implements OnInit {
  readonly store = inject(PracticalGuideStore);

  readonly categories = [
    { value: GuideCategory.ROUTINE, label: 'Rutinas' },
    { value: GuideCategory.CRISIS, label: 'Crisis' },
    { value: GuideCategory.SENSORY_SUPPORT, label: 'Apoyo sensorial' },
    { value: GuideCategory.EMOTIONAL_SUPPORT, label: 'Apoyo emocional' }
  ];

  ngOnInit(): void {
    this.store.loadGuides();
  }

  getCategoryLabel(category: GuideCategory): string {
    return this.categories.find(item => item.value === category)?.label
      ?? category;
  }
}
