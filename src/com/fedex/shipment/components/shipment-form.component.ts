import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShipmentService, ShipmentResponse } from '../services/shipment.service';

@Component({
  selector: 'com-fedex-shipment-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shipment-form.component.html',
  styleUrl: './shipment-form.component.css'
})
export class ShipmentFormComponent {
  shipmentForm: FormGroup;
  shipmentResults = signal<ShipmentResponse[] | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  attributes = ['attr1', 'attr2', 'attr3'];
  shipmentTypes = [
    { label: 'Domestic', value: 'domestic' },
    { label: 'International', value: 'international' }
  ];
  templateTypes = [
    { label: 'Default', value: 'default' },
    { label: 'Temporary', value: 'temporary' }
  ];
  carriers = [
    { label: 'DHL', value: 'dhl' },
    { label: 'Fedex', value: 'fedex' },
    { label: 'UPS', value: 'ups' },
    { label: 'DTH', value: 'dth' }
  ];

  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService
  ) {
    this.shipmentForm = this.fb.group({
      shipmentId: ['', [Validators.required]],
      shipmentType: ['', [Validators.required]],
      templateType: ['', [Validators.required]],
      carriers: [[], [Validators.required]],
      attr1: [false],
      attr2: [false],
      attr3: [false],
      comments: ['']
    });
  }

  onSubmit(): void {
    if (this.shipmentForm.invalid) {
      return;
    }

    const formValue = this.shipmentForm.value;

    // Collect selected attributes
    const selectedAttributes: string[] = [];
    if (formValue.attr1) selectedAttributes.push('attr1');
    if (formValue.attr2) selectedAttributes.push('attr2');
    if (formValue.attr3) selectedAttributes.push('attr3');

    const requestPayload = {
      shipmentId: formValue.shipmentId,
      shipmentType: formValue.shipmentType,
      templateType: formValue.templateType,
      carriers: formValue.carriers,
      attributes: selectedAttributes,
      comments: formValue.comments
    };

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.shipmentService.submitShipment(requestPayload).subscribe({
      next: (response) => {
        this.shipmentResults.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error submitting shipment:', error);
        this.errorMessage.set('Failed to submit shipment. Please check the backend service.');
        this.isLoading.set(false);
      }
    });
  }

  resetForm(): void {
    this.shipmentForm.reset();
    this.shipmentResults.set(null);
    this.errorMessage.set(null);
  }
}

