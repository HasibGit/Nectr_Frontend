import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  busy = 0;
  private spinner = inject(NgxSpinnerService);

  start(): void {
    this.busy++;

    this.spinner.show(undefined, {
      type: 'timer',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
    });
  }

  stop(): void {
    this.busy--;

    if (this.busy <= 0) {
      this.busy = 0;
      this.spinner.hide();
    }
  }
}
