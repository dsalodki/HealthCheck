import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private hubConnection!: signalR.HubConnection;
  private _result: Subject<Result> = new Subject<Result>();
  public result = this._result.asObservable();

  constructor(private http: HttpClient) { }

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(
        environment.baseUrl 
        + 'api/health-hub', { withCredentials: false})
      .build();

    console.log("Starting connection..." + environment.baseUrl);
    this.hubConnection.start().then(() =>
        console.log("Connection started."))
      .catch((err: any) =>
        console.log(err));
      
      this.updateData();
  }
  public addDataListeners() {
    this.hubConnection.on('ClientUpdate',
      (msg) => {
        console.log("Update issued by server for the folowing reason: " + msg);
        this.updateData();
      });
  }
  updateData()
  {
    console.log("Fetching data...");
    this.http.get<Result>(environment.baseUrl + 'api/health')
      .subscribe(result => {
        this._result.next(result);
        console.log(result);
      });
  }

  public sendClientUpdate() {
    this.hubConnection.invoke('ClientUpdate', 'client test')
      .catch(err =>
        console.error(err));
    }
}

export interface Result {
  checks: Check[];
  totalStatus: string;
  totalResponseTime: number;
}

interface Check{
  name: string;
  responseTime: number;
  status: string;
  description: string;
}
