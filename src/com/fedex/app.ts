import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShipmentFormComponent } from './shipment/components/shipment-form.component';

@Component({
  selector: 'com-fedex-root',
  imports: [RouterOutlet, ShipmentFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
