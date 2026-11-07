import { ReservationComponent } from './reservation.component';

describe('ReservationComponent', () => {
  let component: ReservationComponent;

  beforeEach(() => {
    component = new ReservationComponent();
  });

  it('should expose webcam handlers', () => {
    expect(component.initializeWebCam).toBeDefined();
    expect(component.takeSnapshot).toBeDefined();
  });

  it('should calculate total amount from reservations', () => {
    component.reservationList = [
      { amount: 100 },
      { amount: 250 }
    ] as any;

    component.calculateTotal();

    expect(component.totalAmount).toBe(350);
  });
});
