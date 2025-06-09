import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  title?: string;
  message?: string;
  onConfirm!: () => void;

  constructor(public bsModalRef: BsModalRef) {}

  confirm() {
    this.onConfirm?.();
    this.bsModalRef.hide();
  }

  decline() {
    this.bsModalRef.hide();
  }
}
