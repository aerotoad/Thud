import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-website-modal',
  templateUrl: './view-website-modal.component.html',
  styleUrls: ['./view-website-modal.component.scss'],
})
export class ViewWebsiteModalComponent {

  @Input() url: string;
  public safeUrl: SafeResourceUrl;
  
  public refreshHelper: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController
  ) { }

  ionViewWillEnter() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  reload() {
    this.refreshHelper++;
    this.url = this.url + '?refresh=' + this.refreshHelper;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  openExternal() {
    window.open(this.url, '_system', 'location=yes');
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
