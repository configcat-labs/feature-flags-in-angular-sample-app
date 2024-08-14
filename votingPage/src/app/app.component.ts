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
    const configCatClient = configcat.getClient(
      'configcat-sdk-1/cIXcCIFM50eL1D7-bo-KNw/AoEy1jmHOUCAxu7cBz0ypA'
    );

   

    configCatClient.getValueAsync('GrandFeature', false).then((value) => {
      console.log(value);

      this.votingFeatureEnabled = value;
    });
  }
}
