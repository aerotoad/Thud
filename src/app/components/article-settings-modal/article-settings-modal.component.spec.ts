import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArticleSettingsModalComponent } from './article-settings-modal.component';

describe('ArticleSettingsModalComponent', () => {
  let component: ArticleSettingsModalComponent;
  let fixture: ComponentFixture<ArticleSettingsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), ArticleSettingsModalComponent]
}).compileComponents();

    fixture = TestBed.createComponent(ArticleSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
