import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {
    setTimeout(() => {
      document.getElementsByTagName('body')[0].classList.add('dark');
    }, 2000)
  }

}
