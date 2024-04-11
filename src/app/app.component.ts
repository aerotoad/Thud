import { Component, OnInit, inject } from '@angular/core';
import Settings from './models/Settings';
import { StorageService } from './services/storage/storage.service';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class AppComponent implements OnInit {

  public storageService = inject(StorageService);

  async ngOnInit() {
    await this.storageService.initialize();
    const settings: Settings = await this.storageService.getSettings();
    if (settings.theme === 'dark') {
      document.body.classList.add('dark');
    } 
  }
}
