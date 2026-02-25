import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShipmentRequest {
  shipmentId: string;
  shipmentType: string;
  templateType: string;
  carriers: string[];
  attributes: string[];
  comments: string;
}

export interface ShipmentResponse {
  shipmentId: string;
  origin: string;
  destination: string;
  trackStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private apiUrl = 'http://localhost:8080/api/shipment';

  constructor(private http: HttpClient) {}

  submitShipment(request: ShipmentRequest): Observable<ShipmentResponse[]> {
    return this.http.post<ShipmentResponse[]>(this.apiUrl, request);
  }
}

