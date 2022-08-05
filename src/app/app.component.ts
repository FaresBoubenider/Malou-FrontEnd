import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, concat } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { VisualizerService } from './visualizer.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import * as ApexCharts from 'apexcharts';
import { Visualizer } from './Visualizer';

import { ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptionsTotal = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptionsTotal: Partial<ChartOptionsTotal>;
  title = 'Product-Visualizer';

  visualizer = new Visualizer();

  listeOffres$: Observable<Visualizer[]>;
  refreshListeOffres$ = new BehaviorSubject<boolean>(true);

  viewformat = 'card';

  constructor(private visualizerservice: VisualizerService) {}

  ngOnInit(): void {
    //Function that gets all the topics of all the products
    this.visualizerservice.getProductCategorie().subscribe((data) => {
      let labelTotalCategory = [];
      let countTotalCategory = [];

      data['topics'].map((product) => {
        labelTotalCategory.push(product.name);
        countTotalCategory.push(product.posts_count);
      });

      //Once the data is fetched, it is placed in the chart

      this.chartOptionsTotal = {
        series: countTotalCategory,
        chart: {
          width: 1000,
          type: 'pie',
        },
        labels: labelTotalCategory,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };
    });
  }

  checkProducts() {
    //The checkProducts function allows to get the different products at a given date

    var date = (<HTMLInputElement>document.getElementById('date')).value;
    if (date) {
      this.listeOffres$ = this.refreshListeOffres$.pipe(
        switchMap((_) => this.visualizerservice.get_data(date))
      );

      this.visualizerservice.get_data(date).subscribe((data) => {
        let categorieArray = [];
        let productCount = [];
        let labelCategory = [];

        //Once the data is collected, two loops are set up to retrieve the topics of each product

        data['posts'].map((product) => {
          product.topics.map((topic) => {
            let topicName = topic.name;

            //Two conditions are set up

            if (categorieArray.find((o) => o.category == topicName)) {
              //if the topic name exists in the array then the count value is incremented
              let objIndex = categorieArray.findIndex(
                (obj) => obj.category == topicName
              );
              categorieArray[objIndex].count += 1;
            } else {
              //if the topic name does not exist in the table then we push it
              categorieArray.push({ category: topicName, count: 1 });
            }
          });
        });

        //Finally, two tables are filled in to separate the topic names and their increment values
        categorieArray.map((object, index) => {
          labelCategory.push(object.category);
          productCount.push(object.count);
        });
        this.visualizer.chartElements = labelCategory;
        this.visualizer.chartsValues = productCount;

        //The chart can be fed
        this.chartOptions = {
          series: this.visualizer.chartsValues,

          chart: {
            width: 1000,
            type: 'pie',
          },
          labels: this.visualizer.chartElements,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };
      });
    }
  }
}
