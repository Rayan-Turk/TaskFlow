import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.scss',
  templateUrl: './confirm-dialog.html',
  host: { '(document:keydown.escape)': 'cancelled.emit()' },
})
export class ConfirmDialog {
  title = input('Are you sure?');
  message = input.required<string>();
  confirmText = input('Confirm');

  confirmed = output<void>();
  cancelled = output<void>();
}
