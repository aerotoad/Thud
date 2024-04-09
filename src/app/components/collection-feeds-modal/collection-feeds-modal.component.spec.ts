import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CollectionFeedsModalComponent } from './collection-feeds-modal.component';

describe('CollectionFeedsModalComponent', () => {
  let component: CollectionFeedsModalComponent;
  let fixture: ComponentFixture<CollectionFeedsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), CollectionFeedsModalComponent]
}).compileComponents();

    fixture = TestBed.createComponent(CollectionFeedsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
