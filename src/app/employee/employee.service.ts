import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Employee } from '../model/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8880';

  constructor(private http: HttpClient) {}

  getEmployees(hotelId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employee/list?hotelId=${hotelId}`)
      .pipe(catchError(this.handleError));
  }

  getEmployeeById(employeeId: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employee/${employeeId}`)
      .pipe(catchError(this.handleError));
  }

  createEmployee(employee: any): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employee/create`, employee)
      .pipe(catchError(this.handleError));
  }

  updateEmployee(employee: any): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/employee/update`, employee)
      .pipe(catchError(this.handleError));
  }

  deleteEmployee(employeeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employee/delete/${employeeId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
