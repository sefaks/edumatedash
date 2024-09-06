import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {

  private pageTitleMap = new Map<string, string>([
    ['explanation', 'Konuları Anlama Vakti'],
    ['question-answering', 'Soru Çözümü'],
    ['quiz', 'Bildiklerimizi Deneyelim'],
    ['schedule','Ders Programı'],
    ['add-appointment','Add Patient'],
    ['add-doctor','Add Doctor']
  ]);

  constructor(private router:Router) { }


  ngOnInit(): void {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.router.routerState.snapshot.root.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.routeConfig && child.routeConfig.path) {
            return child.routeConfig.path;
          } else {
            break;
          }
        }
        return null;
      })
    )
    .subscribe((url: string | null) => {
      if (url && this.pageTitleMap.has(url)) {
        this.pageTitle = this.pageTitleMap.get(url)!;
      } else {
        this.pageTitle = 'Home';
      }
    });
}

capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



  pageTitle: string = 'Çalışma Masam';


  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

}
