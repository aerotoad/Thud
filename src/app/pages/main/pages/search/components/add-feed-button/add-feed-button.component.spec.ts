import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddFeedButtonComponent } from './add-feed-button.component';

describe('AddFeedButtonComponent', () => {
  let component: AddFeedButtonComponent;
  let fixture: ComponentFixture<AddFeedButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), AddFeedButtonComponent]
}).compileComponents();

    fixture = TestBed.createComponent(AddFeedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
