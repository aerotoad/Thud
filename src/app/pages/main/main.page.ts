import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgClass,
  ],
})
export class MainPage implements OnInit {

  public router = inject(Router);

  public tabs: Array<any> = [
    {
      title: 'Home',
      url: '/main/collection',
      icon: 'home',
      isActive: false
    },
    {
      title: 'Bookmarks',
      url: '/main/bookmarks',
      icon: 'bookmark',
      isActive: false
    },
    {
      title: 'Search',
      url: '/main/search',
      icon: 'search',
      isActive: false
    },
    {
      title: 'Settings',
      url: '/main/settings',
      icon: 'settings',
      isActive: false
    },
  ];

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectTab(event.url.split('?')[0]); 
      }
    });
    //document.getElementsByTagName('body')[0].classList.add('dark');
  }

  ionViewWillEnter() {
    const startUrl: string = this.router.url.split('?')[0]; // remove query params
    this.selectTab(startUrl);
  }

  selectTab(url: string) {
    this.tabs.forEach(tab => {
      if (tab.url === url) {
        tab.isActive = true;
      } else {
        tab.isActive = false;
      }
    });
  }

}
