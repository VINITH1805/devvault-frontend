import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultHistory } from './vault-history';

describe('VaultHistory', () => {
  let component: VaultHistory;
  let fixture: ComponentFixture<VaultHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(VaultHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
