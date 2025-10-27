import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService, UserData as ApiUserData } from './api.service';
import { Observable, of, catchError, tap, map } from 'rxjs';

export interface UserData {
  deviceId: string;
  hoplaTokens: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);
  private userData = signal<UserData>({
    deviceId: '',
    hoplaTokens: 0,
  });
  private isInitialized = signal(false);

  // Computed signal for user state
  userState = computed(() => this.userData());
  isUserInitialized = computed(() => this.isInitialized());

  constructor() {
    this.initializeUser();
  }

  private initializeUser(): void {
    // Generate or retrieve device ID
    let deviceId = this.getStoredDeviceId();
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      this.storeDeviceId(deviceId);
    }

    // Set device ID immediately
    this.userData.set({
      deviceId,
      hoplaTokens: 0,
    });

    // Try to load from backend first, fallback to localStorage
    this.loadUserDataFromBackend(deviceId).subscribe({
      next: (backendData) => {
        if (backendData) {
          this.userData.set(backendData);
          this.storeUserData();
        } else {
          // Fallback to localStorage if backend fails
          this.loadFromLocalStorage(deviceId);
        }
        this.isInitialized.set(true);
      },
      error: () => {
        // Fallback to localStorage if backend is unavailable
        this.loadFromLocalStorage(deviceId);
        this.isInitialized.set(true);
      }
    });
  }

  private loadFromLocalStorage(deviceId: string): void {
    const storedData = this.getStoredUserData();
    if (storedData) {
      this.userData.set({
        deviceId: storedData.deviceId || deviceId,
        hoplaTokens: storedData.hoplaTokens || 0,
      });
    } else {
      this.userData.set({
        deviceId,
        hoplaTokens: 0,
      });
    }
  }

  private loadUserDataFromBackend(deviceId: string): Observable<UserData | null> {
    return this.apiService.getUserData(deviceId).pipe(
      tap(response => {
        // User data loaded or not found
      }),
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          // User not found on backend, return null to use local storage
          return null;
        }
      }),
      catchError(error => {
        // Failed to load from backend, using local storage
        return of(null);
      })
    );
  }

  private generateDeviceId(): string {
    // Generate a unique device ID
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `device_${timestamp}_${randomPart}`;
  }

  private getStoredDeviceId(): string | null {
    return localStorage.getItem('hoplaFly_deviceId');
  }

  private storeDeviceId(deviceId: string): void {
    localStorage.setItem('hoplaFly_deviceId', deviceId);
  }

  private getStoredUserData(): UserData | null {
    try {
      const stored = localStorage.getItem('hoplaFly_userData');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private storeUserData(): void {
    localStorage.setItem('hoplaFly_userData', JSON.stringify(this.userData()));
  }

  addHoplaTokens(amount: number, score?: number): void {
    const currentData = this.userData();
    const newBalance = currentData.hoplaTokens + amount;

    // Update local state immediately
    this.userData.set({
      ...currentData,
      hoplaTokens: newBalance,
    });

    // Store locally
    this.storeUserData();

    // Sync with backend
    this.syncWithBackend(newBalance, score);
  }

  private syncWithBackend(hoplaTokens: number, score?: number): void {
    const currentData = this.userData();

    this.apiService.saveUserData({
      deviceId: currentData.deviceId,
      hoplaTokens,
      score
    }).subscribe({
      next: (response) => {
        // User data synced with backend
      },
      error: (error) => {
        // Failed to sync with backend, data is still saved locally
      }
    });
  }

  getHoplaTokens(): number {
    return this.userData().hoplaTokens;
  }

  getDeviceId(): string {
    return this.userData().deviceId;
  }

  resetUserData(): void {
    const deviceId = this.userData().deviceId;
    this.userData.set({
      deviceId,
      hoplaTokens: 0,
    });
    this.storeUserData();
  }
}
