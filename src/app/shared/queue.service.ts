import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(
    @Inject('API_URL') apiUrl: string,
    http: HttpClient
  ) { }

  register(): void {

  }
}
