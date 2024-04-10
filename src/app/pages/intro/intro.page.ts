import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import Settings from 'src/app/models/Settings';
import { StorageService } from 'src/app/services/storage/storage.service';
import Swiper, { SwiperOptions } from 'swiper';
import { NgClass } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.page.html',
    styleUrls: ['./intro.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        SwiperModule,
        NgClass,
    ],
})
export class IntroPage {

  public storageService = inject(StorageService);
  public router = inject(Router);
  public changeDetector = inject(ChangeDetectorRef);

  private settings: Settings;

  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
  }
  public swiper: Swiper;

  public currentSlide: number = 0;

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
