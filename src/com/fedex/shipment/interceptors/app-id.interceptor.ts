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
  // Match both relative URLs (proxied via dev server) and absolute backend URL
  private readonly BACKEND_ORIGIN = 'http://localhost:8080';
  private readonly PROXIED_PATHS = ['/api/', '/auth/', '/oauth2/', '/login', '/logout'];

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isBackendRequest =
      request.url.startsWith(this.BACKEND_ORIGIN) ||
      this.PROXIED_PATHS.some(path => request.url.startsWith(path));

    // Apply headers and withCredentials only for requests to the backend
    if (isBackendRequest) {
      const clonedRequest = request.clone({
        setHeaders: {
          'X-App-Id': this.APP_ID
        },
        withCredentials: true
      });
      console.log('AppIdInterceptor: Added X-App-Id header and withCredentials to request:', clonedRequest.url);
      return next.handle(clonedRequest);
    }

    return next.handle(request);
  }
}

