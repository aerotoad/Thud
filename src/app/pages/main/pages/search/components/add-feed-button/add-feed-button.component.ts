import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-feed-button',
  templateUrl: './add-feed-button.component.html',
  styleUrls: ['./add-feed-button.component.scss'],
})
export class AddFeedButtonComponent implements OnInit {

  @Input() feedId: string;
  @Input() feedsIds: string[] = [];
  @Input() color: string;	

  constructor() { }

  ngOnInit() {}

  handleButtonAction() {
    if (this.feedsIds.indexOf(this.feedId) === -1) {
      console.log('ACTION!')
    }
  }

}
