import { Component, OnInit } from '@angular/core';
import Settings from './models/Settings';
import { StorageService } from './services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    await this.storageService.initialize();
    const settings: Settings = await this.storageService.getSettings();
    if (settings.theme === 'dark') {
      document.body.classList.add('dark');
    } 
  }
}
