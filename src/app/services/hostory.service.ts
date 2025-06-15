import axios from 'axios';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
    private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Sample API
    private apiHistory = 'http://localhost/public/history/data'; // Sample API
    private limit = 10;
    private currentPage = 1;

    async getPosts(): Promise<any> {
      try {
        const response = await axios.get(`${this.apiUrl}?_page=${this.currentPage}&_limit=${this.limit}`);
        this.currentPage++;
        return response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    }
  
    async getHistory(ip_server: any): Promise<any> {
      const apiHistory = ip_server+'/public/history/data'; // Sample API
      
      try {
        const response = await axios.get(`${apiHistory}?_page=${this.currentPage}&_limit=${this.limit}`);
        this.currentPage++;
        return response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    }
}
