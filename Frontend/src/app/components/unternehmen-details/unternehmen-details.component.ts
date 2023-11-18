import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, switchMap, takeUntil, Subject } from 'rxjs';
import { AppState } from '../../app.state';
import Chart, { scales } from 'chart.js/auto';

@Component({
  selector: 'app-unternehmen-details',
  templateUrl: './unternehmen-details.component.html',
  styleUrls: ['./unternehmen-details.component.scss'],
})
export class UnternehmenDetailsComponent {
  unternehmenNames: string[] = [];
  unternehmenDetails1: string[] = [];
  unternehmenDetails2: string[] = [];
  logo: string[] = [
    '../../../assets/images/logos/',
    '../../../assets/images/logos/',
  ];
  private ngUnsubscribe = new Subject<void>();
  data1: number[] = [];
  data2: number[] = [];
  chart: any;
  isVergleichen: boolean = false;

  selectedUnternehmen1?: Observable<
    {
      val1: number;
      val2: number;
      val3: number;
      val4: number;
      val5: number;
      val6: string;
      val7: string;
      val8: string;
    }[]
  >;
  selectedUnternehmen2?: Observable<
    {
      val1: number;
      val2: number;
      val3: number;
      val4: number;
      val5: number;
      val6: string;
      val7: string;
      val8: string;
    }[]
  >;
  unternehmen$ = this.store.select((state) => state.Unternehmen);

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.unternehmenNames[0] = params['unternehmenName1'];
      this.unternehmenNames[1] = params['unternehmenName2Orfalse'];
      this.isVergleichen = params['unternehmenName2Orfalse'] !== 'false';
    });
    // this.unternehmen$.subscribe((firstItem) => {console.log(firstItem)})
    this.selectedUnternehmen1 = this.unternehmen$.pipe(
      switchMap(() =>
        this.unternehmen$.pipe(
          map((data) =>
            data
              .filter((item) => {
                return item.unternehmenName
                  .toLowerCase()
                  .includes(this.unternehmenNames[0].toLowerCase());
              })
              .map((item) => ({
                val1: item.unternehmenZutrauenScore,
                val2: item.unternehmenZuverlassigkeitScore,
                val3: item.unternehmenIntegritatScore,
                val4: item.unternehmenItSicherheitScore,
                val5: item.itLosungScore,
                val6: item.unternehmenName,
                val7: item.unternehmenDescription,
                val8: item.unternehmenLogo,
              }))
          )
        )
      )
    );
    this.selectedUnternehmen2 = this.unternehmen$.pipe(
      switchMap(() =>
        this.unternehmen$.pipe(
          map((data) =>
            data
              .filter((item) => {
                return item.unternehmenName
                  .toLowerCase()
                  .includes(this.unternehmenNames[1].toLowerCase());
              })
              .map((item) => ({
                val1: item.unternehmenZutrauenScore,
                val2: item.unternehmenZuverlassigkeitScore,
                val3: item.unternehmenIntegritatScore,
                val4: item.unternehmenItSicherheitScore,
                val5: item.itLosungScore,
                val6: item.unternehmenName,
                val7: item.unternehmenDescription,
                val8: item.unternehmenLogo,
              }))
          )
        )
      )
    );
    this.selectedUnternehmen1
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((firstItem) => {
        this.data1 = firstItem.flatMap((f) => [
          f.val1,
          f.val2,
          f.val3,
          f.val4,
          f.val5,
        ]);
        this.unternehmenDetails1 = firstItem.flatMap((f) => [f.val6, f.val7]);
        if (this.data1.length > 0) {
          this.logo[0] += firstItem.flatMap((f) => [f.val8]).pop();
          this.selectedUnternehmen2
            ?.pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((firstItem) => {
              this.data2 = firstItem.flatMap((f) => [
                f.val1,
                f.val2,
                f.val3,
                f.val4,
                f.val5,
              ]);
              this.unternehmenDetails2 = firstItem.flatMap((f) => [
                f.val6,
                f.val7,
              ]);
              this.logo[1] += firstItem.flatMap((f) => [f.val8]).pop();
              this.createChart(
                this.data1,
                this.data2,
                this.unternehmenNames[0],
                this.unternehmenNames[1]
              );
            });
        }
      });
  }

  createChart(data1: any, data2: any, label1: string, label2: string) {
    const dataChart: { labels: string[]; datasets: any[] } = {
      labels: ['', '', '', '', ''],
      datasets: [],
    };

    dataChart.datasets.push({
      label: label1,
      data: data1,
      fill: true,
      backgroundColor: 'rgba(216, 116, 48,0.2)',
      borderColor: 'rgb(216, 116, 48)',
      pointBackgroundColor: 'rgb(216, 116, 48)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(216, 116, 48)',
    });
    if (label2 !== 'false') {
      dataChart.datasets.push({
        label: label2,
        data: data2,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(17, 46, 81)',
        pointBackgroundColor: 'rgb(17, 46, 81)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(17, 46, 81)',
      });
    }

    const images = [
      '../../../assets/images/Zutrauen-icon.png',
      '../../../assets/images/Zuverlassigkeit-icon.png',
      '../../../assets/images/Sicherheit-icon.png',
      '../../../assets/images/Integritat-icon.png',
      '../../../assets/images/Transparenz-icon.png',
    ].map((png) => {
      const image = new Image();
      image.src = png;
      return image;
    });

    this.chart = new Chart('MyChart', {
      type: 'radar',
      data: dataChart,
      plugins: [
        {
          id: 'images_labels',
          afterDraw: (chart) => {
            const ctx = chart.ctx;

            ctx.drawImage(images[0], 225, 33);
            ctx.drawImage(images[1], 440, 190);
            ctx.drawImage(images[2], 365, 450);
            ctx.drawImage(images[3], 105, 450);
            ctx.drawImage(images[4], 15, 190);
          },
        },
      ],
      options: {
        responsive: false,
        elements: {
          line: {
            borderWidth: 4,
          },
        },
        aspectRatio: 2,
        scales: {
          r: {
            pointLabels: {
              font: {
                size: 20,
              },
            },
            grid: {
              lineWidth: 3,
            },
            ticks: { font: { size: 20 } },
          },
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 20,
                weight: 'bold',
              },
            },
          },
        },
      },
    });
  }
  navigateToSicherheit() {
    this.router.navigate([
      '/sicherheit',
      this.unternehmenNames[0],
      this.unternehmenNames[1],
    ]);
  }
}
