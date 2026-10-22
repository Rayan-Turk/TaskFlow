import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-spinner',
  styleUrl: './spinner.scss',
  templateUrl: './spinner.html',
})
export class Spinner {
  label = input('Loading...');
}
