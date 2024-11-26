import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerformanceService } from '../../../services/performance.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-performance-update',
  templateUrl: './performance-update.component.html',
  styleUrl: './performance-update.component.css'
})
export class PerformanceUpdateComponent implements OnInit {
  @Input() performance: any;
  @Input() title: string = 'Update information'; // This will be used to change the title dynamically
  @Input() btnTitle: string = 'Edit';

  performanceForm!: FormGroup;
  loading = false; // Add a loading state

  constructor(
    private fb: FormBuilder,
    private performanceService: PerformanceService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.performanceForm = this.fb.group({
      date: [
        this.performance?.date
          ? new Date(this.performance.date).toISOString().substring(0, 10)
          : '',
        Validators.required,
      ],
      location: [this.performance?.location || '', Validators.required],
      price: [
        this.performance?.price || '',
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  // Submit handler for the form
  savePerformanceDetails(): void {
    if (this.performance) {
      // If performance exists, update it with the form values
      const updatedPerformance = {
        ...this.performance,
        ...this.performanceForm.value, // Merge form data with existing data
      };

      this.loading = true;

      // Call the service to update the performance
      this.performanceService.updatePerformance(updatedPerformance).subscribe(
        (result: any) => {
          this.loading = false;
          // Close the modal after success
          this.activeModal.close(); // Close the modal after saving the performance
        },
        (error: any) => {
          this.loading = false;
          // Handle error
          console.error('Error updating performance', error);
          alert('Error updating performance. Please try again.'); // Notify on error
          //this.toastr.error('Error updating performance. Please try again.'); // Notify on error
        }
      );
    } else {
      // If performance is null/undefined, create a new performance
      const newPerformance = this.performanceForm.value;

      this.loading = true;

      console.log(newPerformance);
      // Call the service to create the new performance
      this.performanceService.createPerformance(newPerformance).subscribe(
        (result: any) => {
          this.loading = false;
          // Close the modal after success
          this.activeModal.close(); // Close the modal after creating the performance
        },
        (error: any) => {
          this.loading = false;
          // Handle error
          console.error('Error creating performance', error);
          alert('Error creating performance. Please try again.'); // Notify on error
          //this.toastr.error('Error creating performance. Please try again.'); // Notify on error
        }
      );
    }
  }

}
