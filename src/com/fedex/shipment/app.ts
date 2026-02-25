import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShipmentFormComponent } from './components/shipment-form.component';

@Component({
  selector: 'com-fedex-shipment-root',
  imports: [RouterOutlet, ShipmentFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

