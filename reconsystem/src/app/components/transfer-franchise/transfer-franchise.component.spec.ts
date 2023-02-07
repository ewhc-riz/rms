import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFranchiseComponent } from './transfer-franchise.component';

describe('TransferFranchiseComponent', () => {
  let component: TransferFranchiseComponent;
  let fixture: ComponentFixture<TransferFranchiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferFranchiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
