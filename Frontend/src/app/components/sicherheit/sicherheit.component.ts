import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, scan, Subject, tap, Subscription, of } from 'rxjs';
import {
  map,
  startWith,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  takeUntil,
  mergeMap,
} from 'rxjs/operators';
import { AppState } from '../../app.state';
import Chart from 'chart.js/auto';
import { Umfrage } from '../../umfrage-config/umfrage.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sicherheit',
  templateUrl: './sicherheit.component.html',
  styleUrls: ['./sicherheit.component.scss'],
})
export class SicherheitComponent implements OnInit {
  @Input('unternehmens') unternehmen: string[] = [];
  @ViewChild('searchBar1') searchBar1: ElementRef | undefined;
  @ViewChild('searchBar2') searchBar2: ElementRef | undefined;

  searchControl1 = new FormControl();
  searchControl2 = new FormControl();

  someUnternehmen1?: Observable<string[]>;
  someUnternehmen2?: Observable<string[]>;

  private navigationSubscription: Subscription | undefined;

  private ngUnsubscribe = new Subject<void>();
  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;
  chart5: any;
  data1: number[] = [];
  data2: number[] = [];
  data3: number[] = [];
  data4: number[] = [];
  data5: number[] = [];
  counter: number = 0;
  unternehmenSize: number = 0;
  jaOderNein: string[] = [];
  ISMSStatus: string[] = [];
  budget: number[] = [];
  VulnTest: string[] = [];
  VulnTestStatus: string[] = [];
  VulnPriority: string[] = [];
  VulnPriorityStatus: string[] = [];
  filteredUmfragen: Umfrage[] = [];
  isVergleichen: boolean = false;
  selectedOptionJaOderNein: string = '';
  selectedOptionnISMS: string = '';
  angabeInProzent: string = '';
  selectedOptionnAusgaben: string = '';
  selectedOptionnITLosungen: string[] = [];

  filteredUnternehmen1?: Observable<boolean>;
  filteredUnternehmen2?: Observable<number>;
  filteredUnternehmen3?: Observable<number>;
  filteredUnternehmen4?: Observable<string>;
  filteredUnternehmen5?: Observable<string>;

  umfragen$ = this.store.select((state) => state.umfragen);
  unternehmen$ = this.store.select((state) => state.Unternehmen);

  items: string[] = [
    'a- Penetrations-Testing',
    'b- Software-Verifikation',
    'c- Fuzzing',
    'd- Red_Teams',
    'e- Bug_Bounty',
  ];
  //  orange     blue      green     gray
  colors: string[] = ['#ff9359', '#666ff2', '#29a603', '#868686'];

  jaNeinOptions: string[] = ['ja', 'nein'];
  ISMSStatusOptions: string[] = [
    'kein ISMS',
    'ISMS fur Kernprozesse',
    'ISMS großtenteils vollständig',
    'ISMS Zertifiziert) Abstufung',
  ];
  budgetOptions: string[] = [
    '0.05',
    '0.06',
    '0.07',
    '0.08',
    '0.09',
    '0.10',
    '0.11',
    '0.12',
    '0.13',
    '0.14',
    '0.15',
    '0.16',
    '0.17',
    '0.18',
    '0.19',
    '0.20',
  ];
  VulnTestOptions: string[] = [
    'Penetrations-Testing',
    'Software-Verifikation',
    'Fuzzing',
    'Red_Teams',
    'Bug_Bounty',
  ];
  VulnPrioretyOptions: string[] = [
    'Mitarbeiter-Awareness',
    'Cloud-Sicherheit',
    'Verfügbarkeit',
    'Cyber-Sicherheits-maßnahmen',
    'Unternehmens-infrastruktur',
  ];

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  toggleItemSelection(item: string) {
    while (this.selectedOptionnITLosungen.length != 0)
      this.selectedOptionnITLosungen.pop();
    for (const option of this.items) {
      if (item.includes(option.charAt(0))) {
        this.selectedOptionnITLosungen.push(option);
      }
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.unternehmen[0] = params['unternehmenName1'];
      this.unternehmen[1] = params['unternehmenName2Orfalse'];
      this.isVergleichen = params['unternehmenName2Orfalse'] !== 'false';
    });

    this.searchControl1.setValue(this.unternehmen[0]);
    this.searchControl2.setValue(this.unternehmen[1]);

    this.unternehmen$.subscribe(
      (unternehmen) => (this.unternehmenSize = unternehmen.length)
    );

    this.someUnternehmen1 = this.searchControl1.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm) =>
        this.unternehmen$.pipe(
          map((data) =>
            data
              .filter((item) =>
                item.unternehmenName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
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
          map((data) =>
            data
              .filter((item) =>
                item.unternehmenName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((filteredItem) => filteredItem.unternehmenName)
              .slice(0, 10)
          )
        )
      )
    );

    this.initCharts();
  }

  initCharts(): void {
    window.scrollTo(0, 0);

    this.umfragen$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((collection) => {
        this.filteredUmfragen = collection.filter(
          (umfrage) => umfrage.unternehmenName === this.unternehmen[0]
        );
        this.selectedOptionJaOderNein = this.filteredUmfragen[0].itSicherheitIOS
          ? 'ja'
          : 'nein';
        this.selectedOptionnISMS =
          this.filteredUmfragen[0].itSicherheitISMSStatus.toString();
        this.angabeInProzent =
          this.filteredUmfragen[0].itSicherheitITSBudget.toString();
        this.selectedOptionnAusgaben =
          this.filteredUmfragen[0].itSicherheitPriority.toString();

        if (!this.isVergleichen)
          this.toggleItemSelection(
            this.filteredUmfragen[0].itSicherheitVulnTest.toString()
          );

        this.jaOderNein[0] = this.filteredUmfragen[0].itSicherheitIOS
          ? 'ja'
          : 'nein';
        this.ISMSStatus[0] =
          this.ISMSStatusOptions[
            this.filteredUmfragen[0].itSicherheitISMSStatus
          ];
        this.budget[0] = this.filteredUmfragen[0].itSicherheitITSBudget;
        this.VulnTest[0] = this.filteredUmfragen[0].itSicherheitVulnTest;
        this.VulnTestStatus[0] = this.getVulnTest(
          this.filteredUmfragen[0].itSicherheitVulnTest
        );
        this.VulnPriority[0] = this.filteredUmfragen[0].itSicherheitPriority;
        this.VulnPriorityStatus[0] = this.getVulnPriority(
          this.filteredUmfragen[0].itSicherheitPriority
        );

        if (this.isVergleichen) {
          this.filteredUmfragen = collection.filter(
            (umfrage) => umfrage.unternehmenName === this.unternehmen[1]
          );
          this.jaOderNein[1] = this.filteredUmfragen[0].itSicherheitIOS
            ? 'ja'
            : 'nein';
          this.ISMSStatus[1] =
            this.ISMSStatusOptions[
              this.filteredUmfragen[0].itSicherheitISMSStatus
            ];
          this.budget[1] = this.filteredUmfragen[0].itSicherheitITSBudget;
          this.VulnTest[1] = this.filteredUmfragen[0].itSicherheitVulnTest;
          this.VulnTestStatus[1] = this.getVulnTest(
            this.filteredUmfragen[0].itSicherheitVulnTest
          );
          this.VulnPriority[1] = this.filteredUmfragen[0].itSicherheitPriority;
          this.VulnPriorityStatus[1] = this.getVulnPriority(
            this.filteredUmfragen[0].itSicherheitPriority
          );
        }
      });

    this.filteredUnternehmen1 = this.umfragen$.pipe(
      switchMap((data) => data.map((item) => item.itSicherheitIOS))
    );

    this.counter = 0;
    this.filteredUnternehmen1
      .pipe(
        takeUntil(this.ngUnsubscribe),
        scan(
          (acc, currentValue) => {
            const trueCount = currentValue ? 1 : 0;
            const falseCount = 1 - trueCount;
            return [acc[0] + trueCount, acc[1] + falseCount];
          },
          [0, 0]
        )
      )
      .subscribe((result) => {
        const [trueCount, falseCount] = result;
        this.data1 = [trueCount, falseCount];
        this.counter++;
        if (this.counter === this.unternehmenSize) {
          this.createChart1(this.data1);
        }
      });

    this.filteredUnternehmen2 = this.umfragen$.pipe(
      switchMap((data) => data.map((item) => item.itSicherheitISMSStatus))
    );
    this.filteredUnternehmen2
      .pipe(
        takeUntil(this.ngUnsubscribe),
        scan(
          (acc, currentValue) => {
            let zeroCount = 0,
              onecount = 0,
              twocount = 0,
              threecount = 0;
            if (currentValue === 0) zeroCount = 1;
            if (currentValue === 1) onecount = 1;
            if (currentValue === 2) twocount = 1;
            if (currentValue === 3) threecount = 1;
            return [
              acc[0] + zeroCount,
              acc[1] + onecount,
              acc[2] + twocount,
              acc[3] + threecount,
            ];
          },
          [0, 0, 0, 0]
        )
      )
      .subscribe((result) => {
        const [zeroCount, oneCount, twoCount, threeCount] = result;
        this.data2 = [zeroCount, oneCount, twoCount, threeCount];

        if (this.counter === this.unternehmenSize) this.counter = 0;

        this.counter++;
        if (this.counter === this.unternehmenSize) {
          this.createChart2(this.data2);
        }
      });

    this.counter = 0;
    this.filteredUnternehmen3 = this.umfragen$.pipe(
      switchMap((data) => data.map((item) => item.itSicherheitITSBudget))
    );
    const counts: Record<number, number> = {};
    this.filteredUnternehmen3
      .pipe(
        tap((num) => {
          if (counts[num]) {
            counts[num]++;
          } else {
            counts[num] = 1;
          }

          if (this.counter === this.unternehmenSize) this.counter = 0;

          this.counter++;
          if (this.counter === this.unternehmenSize) {
            this.data3 = Object.values(counts);
            this.createChart3(this.data3);
          }
        })
      )
      .subscribe();

    this.counter = 0;
    this.filteredUnternehmen4 = this.umfragen$.pipe(
      switchMap((data) => data.map((item) => item.itSicherheitVulnTest))
    );
    this.filteredUnternehmen4
      ?.pipe(
        takeUntil(this.ngUnsubscribe),
        scan(
          (acc, currentValue) => {
            let aCount = 0,
              bCount = 0,
              cCount = 0,
              dCount = 0,
              eCount = 0;
            if (currentValue.includes('a')) aCount = 1;
            if (currentValue.includes('b')) bCount = 1;
            if (currentValue.includes('c')) cCount = 1;
            if (currentValue.includes('d')) dCount = 1;
            if (currentValue.includes('e')) eCount = 1;
            return [
              acc[0] + aCount,
              acc[1] + bCount,
              acc[2] + cCount,
              acc[3] + dCount,
              acc[4] + eCount,
            ];
          },
          [0, 0, 0, 0, 0]
        )
      )
      .subscribe((result) => {
        const [aCount, bCount, cCount, dCount, eCount] = result;
        this.data4 = [aCount, bCount, cCount, dCount, eCount];

        if (this.counter === this.unternehmenSize) this.counter = 0;

        this.counter++;
        if (this.counter === this.unternehmenSize) {
          this.createChart4(this.data4);
        }
      });

    this.counter = 0;
    this.filteredUnternehmen5 = this.umfragen$.pipe(
      switchMap((data) => data.map((item) => item.itSicherheitPriority))
    );
    this.filteredUnternehmen5
      ?.pipe(
        takeUntil(this.ngUnsubscribe),
        scan(
          (acc, currentValue) => {
            let aCount = 0,
              bCount = 0,
              cCount = 0,
              dCount = 0,
              eCount = 0;
            if (currentValue.includes('a')) aCount = 1;
            if (currentValue.includes('b')) bCount = 1;
            if (currentValue.includes('c')) cCount = 1;
            if (currentValue.includes('d')) dCount = 1;
            if (currentValue.includes('e')) eCount = 1;
            return [
              acc[0] + aCount,
              acc[1] + bCount,
              acc[2] + cCount,
              acc[3] + dCount,
              acc[4] + eCount,
            ];
          },
          [0, 0, 0, 0, 0]
        )
      )
      .subscribe((result) => {
        const [aCount, bCount, cCount, dCount, eCount] = result;
        this.data5 = [aCount, bCount, cCount, dCount, eCount];

        if (this.counter === this.unternehmenSize) this.counter = 0;

        this.counter++;
        if (this.counter === this.unternehmenSize) {
          this.createChart5(this.data5);
        }
      });
  }

  navigateToUnternehmenSehen(): void {
    this.router.navigate(['unternehmenList', false]);
  }
  getVulnPriority(option: string): string {
    let result: string = '';
    if (option.includes('a')) result = 'Mitarbeiter-Awareness';
    if (option.includes('b')) {
      if (result.trim() !== '') result += ', ';
      result += 'Cloud-Sicherheit';
    }
    if (option.includes('c')) {
      if (result.trim() !== '') result += ', ';
      result += 'Verfugbarkeit';
    }
    if (option.includes('d')) {
      if (result.trim() !== '') result += ', ';
      result += 'Cyber-Sicherheits-maßnahmen';
    }
    if (option.includes('e')) {
      if (result.trim() !== '') result += ', ';
      result += 'Unternehmens-infrastruktur';
    }
    return result;
  }
  getVulnTest(option: string): string {
    let result: string = '';
    if (option.includes('a')) result = 'Penetrations-Testing';
    if (option.includes('b')) {
      if (result.trim() !== '') result += ', ';
      result += 'Software-Verifikation';
    }
    if (option.includes('c')) {
      if (result.trim() !== '') result += ', ';
      result += 'Fuzzing';
    }
    if (option.includes('d')) {
      if (result.trim() !== '') result += ', ';
      result += 'Red_Teams';
    }
    if (option.includes('e')) {
      if (result.trim() !== '') result += ', ';
      result += 'Bug_Bounty';
    }
    return result;
  }

  createChart1(data: any) {
    let barColors: string[] = ['#868686', '#868686'];

    barColors[this.jaNeinOptions.indexOf(this.jaOderNein[0])] = '#ff9359';
    barColors[this.jaNeinOptions.indexOf(this.jaOderNein[1])] = '#666ff2';

    if (this.isVergleichen && this.jaOderNein[0].includes(this.jaOderNein[1]))
      barColors[this.jaNeinOptions.indexOf(this.jaOderNein[1])] = '#29a603';

    if (this.chart1 instanceof Chart) this.chart1.destroy();

    this.chart1 = new Chart('chart1', {
      type: 'bar',
      data: {
        labels: ['Ja', 'Nein'],
        datasets: [
          {
            data: data,
            backgroundColor: barColors,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  createChart2(data: any) {
    let barColors: string[] = ['#868686', '#868686', '#868686', '#868686'];

    barColors[this.ISMSStatusOptions.indexOf(this.ISMSStatus[0])] = '#ff9359';

    if (this.isVergleichen) {
      barColors[this.ISMSStatusOptions.indexOf(this.ISMSStatus[1])] = '#666ff2';

      if (this.ISMSStatus[0].includes(this.ISMSStatus[1]))
        barColors[this.ISMSStatusOptions.indexOf(this.ISMSStatus[1])] =
          '#29a603';
    }

    if (this.chart2 instanceof Chart) this.chart2.destroy();

    this.chart2 = new Chart('chart2', {
      type: 'bar',
      data: {
        labels: this.ISMSStatusOptions,
        datasets: [
          {
            data: data,
            backgroundColor: barColors,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  createChart3(data: any) {
    let barColors: string[] = [
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
    ];
    let budget1 = this.budget[0].toString(),
      budget2 = '';

    if (this.isVergleichen) budget2 = this.budget[1].toString();

    if (this.budget[0] == 0.1 || this.budget[0] == 0.2)
      budget1 = this.budget[0].toString() + '0';

    if (this.budget[1] == 0.1 || this.budget[1] == 0.2)
      budget2 = this.budget[1].toString() + '0';

    barColors[this.budgetOptions.indexOf(budget1)] = '#ff9359';
    barColors[this.budgetOptions.indexOf(budget2)] = '#666ff2';

    if (this.budget[0] === this.budget[1])
      barColors[this.budgetOptions.indexOf(budget2)] = '#29a603';

    if (this.chart3 instanceof Chart) this.chart3.destroy();

    this.chart3 = new Chart('chart3', {
      type: 'bar',
      data: {
        labels: this.budgetOptions,
        datasets: [
          {
            data: data,
            backgroundColor: barColors,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  createChart4(data: any) {
    let barColors: string[] = [
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
    ];

    let vulnTest: string[] = this.VulnTest[0].split('');
    let vulnTestIndices: number[] = [];

    if (vulnTest.includes('a')) vulnTestIndices.push(0);
    if (vulnTest.includes('b')) vulnTestIndices.push(1);
    if (vulnTest.includes('c')) vulnTestIndices.push(2);
    if (vulnTest.includes('d')) vulnTestIndices.push(3);
    if (vulnTest.includes('e')) vulnTestIndices.push(4);

    vulnTestIndices.forEach((index) => (barColors[index] = '#ff9359'));

    if (this.isVergleichen) {
      vulnTest = this.VulnTest[1].split('');
      vulnTestIndices = [];

      if (vulnTest.includes('a')) vulnTestIndices.push(0);
      if (vulnTest.includes('b')) vulnTestIndices.push(1);
      if (vulnTest.includes('c')) vulnTestIndices.push(2);
      if (vulnTest.includes('d')) vulnTestIndices.push(3);
      if (vulnTest.includes('e')) vulnTestIndices.push(4);

      vulnTestIndices.forEach((index) => {
        if (barColors[index].includes('#ff9359')) barColors[index] = '#29a603';
        else barColors[index] = '#666ff2';
      });
    }

    if (this.chart4 instanceof Chart) this.chart4.destroy();

    this.chart4 = new Chart('chart4', {
      type: 'bar',
      data: {
        labels: this.VulnTestOptions,
        datasets: [
          {
            data: data,
            backgroundColor: barColors,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  createChart5(data: any) {
    let barColors: string[] = [
      '#868686',
      '#868686',
      '#868686',
      '#868686',
      '#868686',
    ];

    let vulnPriorety = this.VulnPriority[0];
    let vulnPrioretyIndex = 0;

    if (vulnPriorety.includes('a')) vulnPrioretyIndex = 0;
    if (vulnPriorety.includes('b')) vulnPrioretyIndex = 1;
    if (vulnPriorety.includes('c')) vulnPrioretyIndex = 2;
    if (vulnPriorety.includes('d')) vulnPrioretyIndex = 3;
    if (vulnPriorety.includes('e')) vulnPrioretyIndex = 4;

    barColors[vulnPrioretyIndex] = '#ff9359';

    if (this.isVergleichen) {
      vulnPriorety = this.VulnPriority[1];
      vulnPrioretyIndex = 0;

      if (vulnPriorety.includes('a')) vulnPrioretyIndex = 0;
      if (vulnPriorety.includes('b')) vulnPrioretyIndex = 1;
      if (vulnPriorety.includes('c')) vulnPrioretyIndex = 2;
      if (vulnPriorety.includes('d')) vulnPrioretyIndex = 3;
      if (vulnPriorety.includes('e')) vulnPrioretyIndex = 4;

      if (barColors[vulnPrioretyIndex].includes('#ff9359'))
        barColors[vulnPrioretyIndex] = '#29a603';
      else barColors[vulnPrioretyIndex] = '#666ff2';
    }

    if (this.chart5 instanceof Chart) this.chart5.destroy();

    this.chart5 = new Chart('chart5', {
      type: 'bar',
      data: {
        labels: this.VulnPrioretyOptions,
        datasets: [
          {
            data: data,
            backgroundColor: barColors,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent) {
    this.navigateToUnternehmenVergleichenChartComponentBySelection(null);
  }
  navigateToUnternehmenVergleichenChartComponentBySelection(selectedItem: any) {
    let pressEnter = true;
    if ((this.searchBar1 && this.searchBar2) || !this.isVergleichen) {
      const inputValue1 = this.searchBar1?.nativeElement.value;
      const inputValue2 = this.searchBar2?.nativeElement.value;

      if (this.navigationSubscription) {
        this.navigationSubscription.unsubscribe();
      }

      this.navigationSubscription = this.unternehmen$
        ?.pipe(
          takeUntil(this.ngUnsubscribe),
          mergeMap((collection1): Observable<any> => {
            const foundIndex1 = collection1.findIndex(
              (item) => item.unternehmenName === inputValue1
            );

            if (foundIndex1 !== -1) {
              if (!this.isVergleichen) {
                this.unternehmen[0] = inputValue1;
                this.initCharts();
              } else
                return this.unternehmen$!.pipe(
                  takeUntil(this.ngUnsubscribe),
                  map((collection2): any => {
                    const foundIndex2 = collection2.findIndex(
                      (item) => item.unternehmenName === inputValue2
                    );

                    if (foundIndex2 !== -1 && inputValue1 !== inputValue2) {
                      this.unternehmen[0] = inputValue1;
                      this.unternehmen[1] = inputValue2;
                      this.initCharts();
                    } else if (pressEnter && inputValue2 !== '') {
                      this.showNotification(
                        'Input is not correct. Please try again.'
                      );
                    }
                    return null;
                  })
                );
            } else if (pressEnter && inputValue2 !== '') {
              this.showNotification('Input is not correct. Please try again.');
              return of(null);
            }
            return of(null);
          })
        )
        .subscribe(() => {
          if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
          }
        });
    }
  }

  showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
