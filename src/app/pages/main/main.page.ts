import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

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

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectTab(event.url);
      }
    });
    //document.getElementsByTagName('body')[0].classList.add('dark');
  }

  ionViewWillEnter() {
    const startUrl: string = this.router.url;
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
