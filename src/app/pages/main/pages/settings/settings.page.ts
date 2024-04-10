import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Settings, { ArticleSettings } from 'src/app/models/Settings';
import { StorageService } from 'src/app/services/storage/storage.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    FormsModule,
    NgClass,
  ],
})
export class SettingsPage {

  public storageService = inject(StorageService);
  public router = inject(Router);

  public settings: Settings;
  public articleSettings: ArticleSettings;

  public cacheTimeoutMinutes: number = 60;

  async ionViewWillEnter() {
    this.settings = await this.storageService.getSettings();
    this.cacheTimeoutMinutes = this.settings.cacheTimeout / 60;
    this.articleSettings = this.settings.articleSettings;
    if (!this.articleSettings) this.articleSettings = {
      fontSize: 12,
      brightness: 0,
      fontFamily: 'sans',
      background: 'default',
      useSystemBrowser: false
    } as ArticleSettings;
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

  async saveSettings() {
    this.settings.cacheTimeout = this.cacheTimeoutMinutes * 60;
    this.settings.articleSettings = this.articleSettings;
    await this.storageService.setSettings(this.settings);
  }

}
