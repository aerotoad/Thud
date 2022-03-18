import { Component } from '@angular/core';
import Settings from 'src/app/models/Settings';
import { ArticleSettings } from 'src/app/models/Settings';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-article-settings-modal',
  templateUrl: './article-settings-modal.component.html',
  styleUrls: ['./article-settings-modal.component.scss'],
})
export class ArticleSettingsModalComponent {

  public settings: Settings;
  public articleSettings: ArticleSettings;

  constructor(
    private storageService: StorageService
  ) { }

  async ionViewWillEnter() {
    this.settings = await this.storageService.getSettings();
    this.articleSettings = this.settings.articleSettings;
    if (!this.articleSettings) this.articleSettings = {
      fontSize: 12,
      brightness: 0,
      fontFamily: 'sans',
      background: 'default'
    } as ArticleSettings;
  }

   async setArticleTheme(theme: 'default' | 'lightbrown' | 'lightgrey' | 'mediumgrey' | 'darkgrey') {
    this.articleSettings.background = theme;
    this.settings.articleSettings = this.articleSettings;
    await this.storageService.setSettings(this.settings);
  }

  async saveSettings() {
    this.settings.articleSettings = this.articleSettings;
    await this.storageService.setSettings(this.settings);
  }


}
