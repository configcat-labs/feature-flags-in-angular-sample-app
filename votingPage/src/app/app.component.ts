import { Component } from '@angular/core';
import * as configcat from "configcat-js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'votingPage';
  votingFeatureEnabled:boolean = false;

  constructor() {
    let configCatClient = configcat.createClient("YOUR_SDK_KEY");
    configCatClient.getValueAsync("votingOpen",  false)
    .then( value => {
      this.votingFeatureEnabled = value;
    });
  }
}
