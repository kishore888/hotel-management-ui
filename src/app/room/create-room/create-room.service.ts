import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateRoomService {

  constructor(private http: HttpClient) { }

  createRoom(formData: any) {
    const headers = {'Content-Type': 'application/json'};
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    this.http.post('http://localhost:8880/room/create', formData, {headers}).subscribe(response => {
      console.log('Form submitted successfully', response);
    });;
    
    //   this.http.post('http://localhost:8080/api/users', formData).subscribe(response => {
    //     console.log('Form submitted successfully', response);
    // }
  }
  
}
