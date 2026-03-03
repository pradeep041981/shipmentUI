import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppIdInterceptor implements HttpInterceptor {
  private readonly APP_ID = 'shipmentUI';

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request and add the X-App-Id header
    const clonedRequest = request.clone({
      setHeaders: {
        'X-App-Id': this.APP_ID
      }
    });

    console.log('AppIdInterceptor: Added X-App-Id header to request:', clonedRequest.url);
    return next.handle(clonedRequest);
  }
}

