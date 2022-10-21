import { Component, OnInit } from '@angular/core';

import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { HealthCheckService } from './health-check.service';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit
{
  public result: Observable<Result | null>;

  constructor(private service: HealthCheckService)
  {
    this.result = service.result;
  }

  ngOnInit(): void
  {
    //   this.http.get<Result>(environment.baseUrl + 'api/health').subscribe(result => {
    //       this.result = result;
    //     },
    //     error => console.error(error));

    this.service.startConnection();
    this.service.addDataListeners();
  }

  onRefresh() {
    this.service.sendClientUpdate();
   }
}

interface Result
{
  checks: Check[];
  totalStatus: string;
  totalResponseTime: number;
}

interface Check
{
  name: string;
  responseTime: number;
  status: string;
  description: string;
}
