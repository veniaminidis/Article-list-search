import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];
  searchKeyword = '';
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchArticles();

    //
    this.searchSubject.pipe(
      debounceTime(750),
      distinctUntilChanged()  //Subject emits only when the current value is different than the last.
    ).subscribe(keyword => {
      this.filterArticles(keyword);
    });
  }

  fetchArticles() {
    this.http.get<any>('assets/article-data.json')
      .subscribe(response => {
        this.articles = response.data.map((article: any) => {
          return {
            title: article.attributes.title,
            body: article.attributes.body,
            //created: article.attributes.created,
            //updated: article.attributes.updated,
            //author: response.included.find((item: any) => item.type === 'people' && item.id === article.relationships.author.data.id)
          };
        });
      });
  }

  filterArticles(keyword: string) {
    //filter articles title and body with kewword while case insensitive
    this.articles = this.articles.filter(article =>
      article.title.toLowerCase().includes(keyword.toLowerCase()) ||
      article.body.toLowerCase().includes(keyword.toLowerCase())
    );
  
    // If the search box is empty fetch all arlicles again
    if (keyword.length === 0) {
      this.fetchArticles();
    }
  }


  onSearch(event: Event) {
    const keyword = (event.target as HTMLInputElement).value;
    //Feed new value to Subject
    this.searchSubject.next(keyword);
  }

}
