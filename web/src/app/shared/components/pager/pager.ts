import { Component, computed, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-pager',
  styleUrl: './pager.scss',
  templateUrl: './pager.html',
})
export class Pager {
  page = input.required<number>();
  pageSize = input.required<number>();
  totalCount = input.required<number>();

  pageChange = output<number>();

  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));

  pages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.page();

    const keep = new Set<number>();
    for (const n of [1, total, current - 1, current, current + 1]) {
      if (n >= 1 && n <= total) keep.add(n);
    }

    const sorted = [...keep].sort((a, b) => a - b);

    const result: (number | '...')[] = [];
    let prev = 0;
    for (const n of sorted) {
      if (n - prev === 2) result.push(prev + 1);
      else if (n - prev > 2) result.push('...');
      result.push(n);
      prev = n;
    }
    return result;
  });
}
