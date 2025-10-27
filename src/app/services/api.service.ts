import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface UserData {
  deviceId: string;
  hoplaTokens: number;
  totalWins?: number;
  lastUpdated?: string;
}

export interface SaveUserDataRequest {
  deviceId: string;
  hoplaTokens: number;
  score?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = '/.netlify/functions';
  private isOnline = new BehaviorSubject<boolean>(navigator.onLine);

  constructor(private http: HttpClient) {
    // Listen for online/offline events
    window.addEventListener('online', () => this.isOnline.next(true));
    window.addEventListener('offline', () => this.isOnline.next(false));
  }

  get isOnline$(): Observable<boolean> {
    return this.isOnline.asObservable();
  }

  /**
   * Save user data to the backend
   */
  saveUserData(userData: SaveUserDataRequest): Observable<ApiResponse<UserData>> {
    return this.http.post<ApiResponse<UserData>>(`${this.baseUrl}/save-user-data`, userData)
      .pipe(
        tap(response => {
          // User data saved
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get user data from the backend
   */
  getUserData(deviceId: string): Observable<ApiResponse<UserData>> {
    return this.http.get<ApiResponse<UserData>>(`${this.baseUrl}/get-user-data?deviceId=${encodeURIComponent(deviceId)}`)
      .pipe(
        tap(response => {
          // User data retrieved
        }),
        catchError(error => {
          // Handle 404 as a normal response (user not found)
          if (error.status === 404) {
            return of({
              success: false,
              error: 'User not found'
            } as ApiResponse<UserData>);
          }
          // For other errors, use the normal error handler
          return this.handleError(error);
        })
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Network error - please check your connection';
      } else if (error.status === 400) {
        errorMessage = 'Invalid request data';
      } else if (error.status === 404) {
        errorMessage = 'User not found';
      } else if (error.status === 500) {
        errorMessage = 'Server error - please try again later';
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
