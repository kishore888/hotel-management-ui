import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateRoomServiceService {
  
  constructor(private http: HttpClient) { }

  createRoom(formData: any) {
    const headers = {'Content-Type': 'application/json'};
    return this.http.post('http://localhost:8880/room/create', formData, {headers});
    
    //   this.http.post('http://localhost:8080/api/users', formData).subscribe(response => {
    //     console.log('Form submitted successfully', response);
    // }
  }
}
