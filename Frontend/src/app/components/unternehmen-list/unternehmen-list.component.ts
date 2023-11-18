import { Component, OnInit, ElementRef, HostListener, ViewChild, Renderer2  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { map, startWith, mergeMap, distinctUntilChanged, debounceTime, switchMap, takeUntil} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { Router,ActivatedRoute  } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-unternehmen-list',
  templateUrl: './unternehmen-list.component.html',
  styleUrls: ['./unternehmen-list.component.scss'],
})
export class UnternehmenListComponent implements OnInit {

  @ViewChild('searchBar1') searchBar1: ElementRef | undefined;
  @ViewChild('searchBar2') searchBar2: ElementRef | undefined;

  searchControl1 = new FormControl();
  searchControl2 = new FormControl();
  

  someUnternehmen1?: Observable<string[]>;
  someUnternehmen2?: Observable<string[]>;

  isVergleichen : boolean = false;
  unternehmen$ = this.store.select((state) => state.Unternehmen);
  private ngUnsubscribe = new Subject<void>();
  private navigationSubscription: Subscription | undefined;

  constructor(private store: Store<AppState>, private router: Router, private snackBar: MatSnackBar, private route: ActivatedRoute, private renderer: Renderer2) {

  }
  
  ngOnInit() {
    
   this.route.params.subscribe((params) => {
      this.isVergleichen = params['isVergleichen'] === 'true';
    });
    this.someUnternehmen1 = this.searchControl1.valueChanges.pipe(
      startWith(''),  
      debounceTime(300), 
      distinctUntilChanged(),  
      switchMap((searchTerm) =>
        this.unternehmen$.pipe(
          map((data) => data.filter((item) => item.unternehmenName.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((filteredItem) => filteredItem.unternehmenName)
                            .slice(0, 10)
          )
        )
      ) 
    );
    this.someUnternehmen2 = this.searchControl2.valueChanges.pipe(
      startWith(''),  
      debounceTime(300), 
      distinctUntilChanged(),  
      switchMap((searchTerm) =>
        this.unternehmen$.pipe(
          map((data) => data.filter((item) => item.unternehmenName.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((filteredItem) => filteredItem.unternehmenName)
                            .slice(0, 10)
          )
        )
      ) 
    );
  } 

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent) {
      this.navigateToUnternehmenVergleichenChartComponent();
  }
  navigateToUnternehmenVergleichenChartComponent() {
    let pressEnter = true;
    if ((this.searchBar1 && this.searchBar2) || !this.isVergleichen) {
      const inputValue1 = this.searchBar1?.nativeElement.value;
      const inputValue2 = this.searchBar2?.nativeElement.value;
  
      if (this.navigationSubscription) {
        this.navigationSubscription.unsubscribe();
      }
      // this.someUnternehmen2?.subscribe((firstItem) => {console.log(firstItem)})

      this.navigationSubscription = this.unternehmen$?.pipe(
        takeUntil(this.ngUnsubscribe),
        mergeMap((collection1): Observable<any> => {
          const foundIndex1 = collection1.findIndex((item) => item.unternehmenName === inputValue1);
  
          if (foundIndex1 !== -1) {
            if(!this.isVergleichen)
              this.router.navigate(['/unternehmenvergleichenchart', inputValue1, 'false']);
            else return this.unternehmen$!.pipe( 
                  takeUntil(this.ngUnsubscribe),
                  map((collection2): any => {
                    const foundIndex2 = collection2.findIndex((item) => item.unternehmenName === inputValue2);
      
                    if (foundIndex2 !== -1 && inputValue1 !== inputValue2) {
                      this.router.navigate(['/unternehmenvergleichenchart', inputValue1, inputValue2]);
                    } else if (pressEnter && inputValue2 !== "") {
                      this.showNotification('Input is not correct. Please try again.');
                    }
                    return null;
                  })
                );
          } else if (pressEnter && inputValue2 !== "") {
            this.showNotification('Input is not correct. Please try again.');
            return of(null);
          }
          return of(null);
      })
    ).subscribe(() => {
      if (this.navigationSubscription) {
        this.navigationSubscription.unsubscribe();
      }
    });
  }
}
  navigateToUnternehmenVergleichenChartComponentBySelection(selectedItem: any) {
    this.navigateToUnternehmenVergleichenChartComponent();
  }

  showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
