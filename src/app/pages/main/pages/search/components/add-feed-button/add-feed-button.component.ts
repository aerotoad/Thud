import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddFeedModalComponent } from 'src/app/components/add-feed-modal/add-feed-modal.component';

@Component({
  selector: 'app-add-feed-button',
  templateUrl: './add-feed-button.component.html',
  styleUrls: ['./add-feed-button.component.scss'],
})
export class AddFeedButtonComponent implements OnInit {

  @Input() feedId: string;
  @Input() feedsIds: string[] = [];
  @Input() color: string;

  @Output() updateFeedIds: EventEmitter<boolean> = new EventEmitter();

  public exists: boolean;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  ngOnChanges() {
    this.exists = this.feedsIds?.indexOf(this.feedId) !== -1;
  }

  handleButtonAction() {
    if (this.feedsIds?.indexOf(this.feedId) === -1) {
      this.handleAddFeed();
    }
  }

  async handleAddFeed() {
    const modal = await this.modalCtrl.create({
      component: AddFeedModalComponent,
      componentProps: {
        feedId: this.feedId
      },
      breakpoints: [0, 0.5, 0.7, 1],
      initialBreakpoint: 0.7
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data.collection) {
          this.feedsIds.push(this.feedId);
          this.updateFeedIds.emit(true);
        }
      });
    await modal.present();
  }

}
