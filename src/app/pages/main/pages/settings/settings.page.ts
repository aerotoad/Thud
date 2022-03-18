import { Component } from '@angular/core';
import Settings, { ArticleSettings } from 'src/app/models/Settings';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  public settings: Settings;
  public articleSettings: ArticleSettings;

  constructor(
    private storageService: StorageService
  ) { }

  async ionViewWillEnter() {
    this.settings = await this.storageService.getSettings();
    this.articleSettings = this.settings.articleSettings;
    if (!this.articleSettings) this.articleSettings = {} as ArticleSettings;
  }

  async setTheme(theme: 'light' | 'dark') {
    this.settings.theme = theme;
    await this.storageService.setSettings(this.settings);
    if (theme === 'dark') {
      document.body.classList.add('dark');
      this.setArticleTheme('darkgrey');
    } else {
      this.setArticleTheme('default');
      document.body.classList.remove('dark');
    }
  }

  async setArticleTheme(theme: 'default' | 'lightbrown' | 'lightgrey' | 'mediumgrey' | 'darkgrey') {
    this.articleSettings.background = theme;
    this.settings.articleSettings = this.articleSettings;
    await this.storageService.setSettings(this.settings);
  }

}
