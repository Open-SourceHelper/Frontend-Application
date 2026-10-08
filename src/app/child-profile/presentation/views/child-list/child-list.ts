import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { Child } from '../../../domain/model/child.entity';
import { ChildStore } from '../../../application/child.store';
import { ChildForm } from '../../components/child-form/child-form';
import {DateTime} from '../../../../shared/domain/model/date-time';

@Component({
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    ChildForm
  ],
  selector: 'app-child-list',
  styleUrl: './child-list.css',
  templateUrl: './child-list.html',
})
export class ChildList {
  readonly store = inject(ChildStore);
  readonly editingChild = signal<Child | null>(null);

  ngOnInit(): void {
    this.store.loadChildren();
  }

  onChildCreated(child: Child): void {
    if (this.store.loading()) {
      return;
    }
    this.store.createChild(child);
  }

  private copyChild(
    child: Child
  ): Child {
    return new Child(
      child.id,
      child.parentId,
      child.firstName,
      child.lastName,
      new Date(child.birthDate),
      new DateTime(child.createdAt.toString())
    );
  }

  startEditing(child: Child): void {
    if (this.store.loading()) {
      return;
    }

    this.editingChild.set(this.copyChild(child));
  }

  cancelEditing(): void {
    this.editingChild.set(null);
  }

  saveChanges(firstName: string, lastName: string, birthDate: string): void {
    const child = this.editingChild();

    if (!child || this.store.loading()) {
      return;
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName || !birthDate) {
      alert('Ingrese el nombre, apellido y fecha de nacimiento.');
      return;
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    const parsedBirthDate = new Date(year, month - 1, day);

    const invalidDate =
      Number.isNaN(parsedBirthDate.getTime()) ||
      parsedBirthDate.getFullYear() !== year ||
      parsedBirthDate.getMonth() !== month - 1 ||
      parsedBirthDate.getDate() !== day;

    if (invalidDate) {
      alert('Ingrese una fecha de nacimiento válida.');
      return;
    }

    const updatedChild = new Child(
      child.id,
      child.parentId,
      trimmedFirstName,
      trimmedLastName,
      parsedBirthDate,
      new DateTime(child.createdAt.toString())
    );

    this.store.updateChild(updatedChild);
    this.editingChild.set(null);
  }


}
