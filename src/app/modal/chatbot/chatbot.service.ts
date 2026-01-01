import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    const headers = {'Content-Type': 'application/json'};
    const body = { message }; 
    // return this.http.post('http://localhost:8880/kpi/chatbot/chat', message, { responseType: 'text' });
    return this.http.post('http://localhost:8880/kpi/chatbot/chat', body, { headers, responseType: 'text' });

  }

}
