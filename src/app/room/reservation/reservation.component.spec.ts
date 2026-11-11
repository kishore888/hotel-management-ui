import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReservationComponent } from './reservation.component';

describe('ReservationComponent', () => {
  let component: ReservationComponent;

  beforeEach(() => {
    const mockReservationService = {
      createReservation: jasmine.createSpy('createReservation').and.returnValue(of({ status: 200, body: 'ok' }))
    };

    const mockPaymentAccountService = {
      getPaymentAccounts: jasmine.createSpy('getPaymentAccounts').and.returnValue(of([]))
    };

    const mockRoomService = {
      getRooms: jasmine.createSpy('getRooms').and.returnValue(of([]))
    };

    const mockRouter = {
      events: { pipe: () => ({ subscribe: () => undefined }) },
      navigate: jasmine.createSpy('navigate')
    };

    component = new ReservationComponent(
      mockReservationService as any,
      { detectChanges: () => undefined } as any,
      mockPaymentAccountService as any,
      mockRoomService as any,
      mockRouter as any
    );
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

  it('should generate a QR code for online payment', () => {
    component.totalAmount = 250;

    component.buildOnlinePaymentQrCode();

    expect(component.qrCodeUrl).toContain('api.qrserver.com');
    expect(component.qrCodeUrl).toContain('upi%3A%2F%2Fpay');
    expect(component.qrCodeUrl).toContain('250');
  });

  it('should redirect to room list after successful online payment', fakeAsync(() => {
    const navigateSpy = (component as any).router.navigate as jasmine.Spy;
    const createReservationSpy = (component as any).reservationService.createReservation as jasmine.Spy;
    createReservationSpy.and.returnValue(of({ status: 200, body: 'ok' }));

    component.customer.firstName = 'John';
    component.customer.lastName = 'Doe';
    component.customer.phoneNo1 = '9876543210';
    component.customer.emailId = 'john@example.com';
    component.customer.gender = 'Male';
    component.customer.idValue = 'ABC123';
    component.paymentType = 'ONLINE';
    component.paymentAccountId = 'PA-1';
    component.hotelPaymentGatewayId = 'HG-1';
    component.reservationList = [{
      room: { roomId: 'R1', roomNumber: '101', roomCharges: 250 },
      checkIn: '2026-11-09T12:00',
      checkOut: '2026-11-09T18:00',
      amount: 250
    }];

    component.completeOnlinePayment();
    tick(600);

    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy.calls.mostRecent().args[0][0]).toBe('/room');
  }));
});
