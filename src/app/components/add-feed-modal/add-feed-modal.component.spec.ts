import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddFeedModalComponent } from './add-feed-modal.component';

describe('AddFeedModalComponent', () => {
  let component: AddFeedModalComponent;
  let fixture: ComponentFixture<AddFeedModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), AddFeedModalComponent]
}).compileComponents();

    fixture = TestBed.createComponent(AddFeedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
