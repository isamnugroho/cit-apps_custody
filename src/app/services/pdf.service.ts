import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class PdfService {
constructor(private http: HttpClient) {}

downloadPdf(url: string) {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    return this.http.get(url, {
        headers,
        responseType: 'blob', // Handle the response as a binary file
    });
}
}
  