import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Settings from 'src/app/models/Settings';
import { StorageService } from 'src/app/services/storage/storage.service';
import Swiper, { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage {

  private settings: Settings;

  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
  }
  public swiper: Swiper;

  public currentSlide: number = 0;
    
  constructor(
    private storageService: StorageService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    this.settings = await this.storageService.getSettings();

    // If dark theme is enabled, disable it
    if (this.settings.theme === 'dark') {
      document.body.classList.remove('dark');
    }
  }

  ionViewDidLeave() {
    // If dark theme is enabled, enable it before leaving
    if (this.settings.theme === 'dark') {
      document.body.classList.add('dark');
    }
  }

  startSwiper(swiper) {
    console.log(swiper);
    this.swiper = swiper;
  }

  onSlideChange([swiper]) {
    this.currentSlide = swiper.activeIndex;
    this.changeDetector.detectChanges();
  }

  nextSlide() {
    this.swiper.slideNext();
  }

  async finish() {
    this.settings.introVersion = 1;
    await this.storageService.setSettings(this.settings);
    this.router.navigate(['/main'], { replaceUrl: true });
  }

}
