import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articles: string[] = [
    'Article 1',
    'Article 2',
    'Article 3',
    'Angular Article',
    'Another Article',
    'Some Other Article'
  ];

  getArticles(): Observable<string[]> {
    return of(this.articles);
  }
}
