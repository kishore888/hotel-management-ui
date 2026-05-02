import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EmployeeShiftSchedule } from '../model/employee-shift-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeShiftScheduleService {
  private apiUrl = 'http://localhost:8880';

  constructor(private http: HttpClient) {}

  getByEmployee(employeeId: string): Observable<EmployeeShiftSchedule[]> {
    return this.http.get<EmployeeShiftSchedule[]>(`${this.apiUrl}/employeeShiftSchedule/getByEmployee/${employeeId}`)
      .pipe(catchError(this.handleError));
  }

  getByDateRange(employeeId: string, from: string, to: string): Observable<EmployeeShiftSchedule[]> {
    return this.http.get<EmployeeShiftSchedule[]>(
      `${this.apiUrl}/employeeShiftSchedule/getByEmployeeAndDateRange?employeeId=${employeeId}&from=${from}&to=${to}`
    ).pipe(catchError(this.handleError));
  }

  getByDate(date: string): Observable<EmployeeShiftSchedule[]> {
    return this.http.get<EmployeeShiftSchedule[]>(`${this.apiUrl}/employeeShiftSchedule/getByDate/${date}`)
      .pipe(catchError(this.handleError));
  }

  create(schedule: any): Observable<EmployeeShiftSchedule> {
    return this.http.post<EmployeeShiftSchedule>(`${this.apiUrl}/employeeShiftSchedule/create`, schedule)
      .pipe(catchError(this.handleError));
  }

  update(schedule: any): Observable<EmployeeShiftSchedule> {
    return this.http.put<EmployeeShiftSchedule>(`${this.apiUrl}/employeeShiftSchedule/update`, schedule)
      .pipe(catchError(this.handleError));
  }

  delete(shiftScheduleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employeeShiftSchedule/delete/${shiftScheduleId}`)
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
