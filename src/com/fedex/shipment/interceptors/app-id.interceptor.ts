import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppIdInterceptor implements HttpInterceptor {
  private readonly APP_ID = 'shipmentUI';
  private readonly BACKEND_ORIGIN = 'http://localhost:8080';
  private readonly PROXIED_PATHS = ['/api/'];

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isBackendRequest =
      request.url.startsWith(this.BACKEND_ORIGIN) ||
      this.PROXIED_PATHS.some(path => request.url.startsWith(path));

    if (isBackendRequest) {
      const token = this.authService.getToken();
      const headers: Record<string, string> = { 'X-App-Id': this.APP_ID };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const clonedRequest = request.clone({ setHeaders: headers });
      console.log('AppIdInterceptor: Added Bearer token + X-App-Id to request:', clonedRequest.url);
      return next.handle(clonedRequest);
    }

    return next.handle(request);
  }
}
