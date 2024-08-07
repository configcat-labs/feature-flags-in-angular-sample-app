import { Component } from '@angular/core';
import * as configcat from 'configcat-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'votingPage';
  votingFeatureEnabled: boolean = false;

  constructor() {
    let configCatClient = configcat.createClient(
      'configcat-sdk-1/cIXcCIFM50eL1D7-bo-KNw/AoEy1jmHOUCAxu7cBz0ypA'
    );
    console.log(configCatClient.getValueAsync('grandFeature', false));
    configCatClient.getValueAsync('grandFeature', false).then((value) => {
      this.votingFeatureEnabled = value;
    });
  }
}
