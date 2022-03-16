import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import SearchQuery, { SearchResult } from 'src/app/models/SearchQuery';
import { FeedlyService } from 'src/app/services/feedly/feedly.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {

  @Input() feedIds: string[];

  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    navigation: false
  }
  public currentSlide: number = 0;

  public featured: SearchResult[];
  public trending: SearchResult[];

  constructor(
    private feedlyService: FeedlyService,
    private toastCtrl: ToastController,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadFeatured();
    this.loadTrending();
  }

  onSlideChange([swiper]) {
    this.currentSlide = swiper.activeIndex;
    this.changeDetector.detectChanges();
  }

  loadFeatured() {
    this.feedlyService.search('Technology', 10, 'en')
      .then((data: SearchQuery) => {
        let sorted = data.results.sort((a, b) => { return a.score + b.score });
        sorted = sorted.filter((item) => {
          if (!item.title.toLowerCase().includes('google')) {
            if (item.visualUrl) {
              return true;
            }
          }
        });
        this.featured = sorted.slice(0, 5);
        //alert(JSON.stringify(this.featured, null, 2));
      })
      .catch((error) => {
        this.showToast('Error loading featured', 'danger');
      });
  }

  loadTrending() {
    this.feedlyService.search('World', 25, 'en')
      .then((data: SearchQuery) => {
        let sorted = data.results.sort((a, b) => { return a.subscribers + b.subscribers });
        this.trending = sorted;
      })
      .catch((error) => {
        this.showToast('Error loading trending', 'danger');
      });
  }

  async showToast(message: string, color?: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

}
