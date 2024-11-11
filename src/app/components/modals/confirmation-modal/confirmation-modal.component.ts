import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {

  action!: string;

  constructor(public activeModal: NgbActiveModal) {}

  onNow(): void {
    this.action = 'now';
    this.activeModal.close(this.action);
  }
  
}
