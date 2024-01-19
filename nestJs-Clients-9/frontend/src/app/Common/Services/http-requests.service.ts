import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClient } from '../Model/Client';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  private apiModule = 'clients';
  private mainUrl = `${environment.apiUrl}/` + this.apiModule;

  constructor(private http: HttpClient) { }

  private getRequestOptions(): { headers: HttpHeaders } {
    const headers = new HttpHeaders();
    return { headers };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage))
  }

  getAll(): Observable<IClient[]> {
    return this.http.get<IClient[]>(this.mainUrl).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<IClient> {
    return this.http.get<IClient>(this.mainUrl + '/' + id).pipe(catchError(this.handleError));
  }

  add(body: IClient): Observable<IClient> {
    return this.http.post<IClient>(this.mainUrl, body, this.getRequestOptions()).pipe(catchError(this.handleError));
  }

  update(id: number, body: IClient): Observable<IClient> {
    return this.http.put<IClient>(this.mainUrl + '/' + id, body, this.getRequestOptions()).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<IClient> {
    return this.http.delete<IClient>(this.mainUrl + '/' + id).pipe(catchError(this.handleError));
  }

}
