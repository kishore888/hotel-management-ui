import { Component, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReservationService } from './reservation.service';
import { PaymentAccountService } from '../../payment/payment-account/payment-account.service';
import { RoomService } from '../../room/room.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-reservation',
  standalone: false,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnDestroy {
  @ViewChild('videoPreview') videoPreview?: ElementRef<HTMLVideoElement>;
  @ViewChild('captureCanvas') captureCanvas?: ElementRef<HTMLCanvasElement>;
  customer = {
    customerId: '',
    customerImage: '',
    firstName: '',
    lastName: '',
    phoneNo1: '',
    middleName: '',
    gender: '',
    phoneNo2: '',
    emailId: '',
    doorNo: '',
    state: '',
    idType: '',
    street: '',
    country: '',
    idValue: '',
    city: '',
    religion: '',
    occupation: ''
  };

  reservationList: Array<any> = [
    // {
    //   room: { roomId: '', roomNumber: '101', roomCharges: 1200 },
    //   reservationId: '',
    //   checkIn: '',
    //   checkOut: '',
    //   amount: 1200
    // }
  ];

  paymentType = 'CASH';
  paymentAccountId = '';
  hotelPaymentGatewayId = '';
  totalAmount = 0;
  totalCharges = 0;
  balanceAmount = 0;
  paymentAccountList: Array<any> = [];
  availableRooms: Array<any> = [];
  isCameraActive = false;
  webcamError = '';
  submissionMessage = '';
  isWebcamMaximized = false;
  isOnlinePaymentSelected = false;
  qrCodeUrl = '';
  private stream: MediaStream | null = null;
  upiId = '';
  private readonly payeeName = 'Hotel Booking';

  constructor(private reservationService: ReservationService, private cdr: ChangeDetectorRef,
    private paymentAccountService: PaymentAccountService,
    private roomService: RoomService,
    private router: Router
  ) {
    // Subscribe to router events to detect navigation to this component
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects.includes('/room/reservation')) {
        console.log('Navigated to reservation page, reloading data');
        this.loadPaymentAccounts();
        this.loadAvailableRooms();
        this.handleNavigationState();
      }
    });
  }

  ngOnInit(): void {
    this.loadPaymentAccounts();
    this.loadAvailableRooms();
    this.handleNavigationState();
  }

  handleNavigationState(): void {
    const navRoom = (history.state && history.state['room']) ? history.state['room'] : null;
    const navRooms = (history.state && history.state['rooms']) ? history.state['rooms'] : null;

    if (navRooms && navRooms.length > 0) {
      // Handle multiple rooms selected from room list
      this.reservationList = navRooms.map((room: any) => ({
        room: room,
        reservationId: '',
        checkIn: '',
        checkOut: '',
        amount: room.roomCharges || 0
      }));
      console.log('Multiple rooms loaded:', this.reservationList);
    } else if (navRoom) {
      // Handle single room
      if (this.reservationList.length === 0) {
        this.reservationList.push({
          room: navRoom,
          reservationId: '',
          checkIn: '',
          checkOut: '',
          amount: navRoom.roomCharges || 0
        });
      } else {
        this.reservationList[0].room = navRoom;
        this.reservationList[0].amount = navRoom.roomCharges || 0;
      }
    } else {
      console.warn('No room data found in navigation state');
    }

    this.calculateTotal();
  }

  loadAvailableRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.availableRooms = rooms || [];
        console.log('Available rooms loaded:', this.availableRooms);
      },
      error: (error) => {
        console.error('Failed to load available rooms', error);
        this.availableRooms = [];
      }
    });
  }

  loadPaymentAccounts(): void {
    if (this.paymentAccountService) {
      this.paymentAccountService.getPaymentAccounts().subscribe({
        next: (accounts) => {
          console.log('Payment accounts loaded:', accounts);
          this.paymentAccountList = accounts || [];
          this.cdr.detectChanges(); // Force change detection
        },
        error: (error) => {
          console.error('Failed to load payment accounts', error);
          this.paymentAccountList = [];
          this.cdr.detectChanges(); // Force change detection
        }
      });
    }
  }

  initializeWebCam(): void {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.webcamError = 'Webcam is not supported in this browser.';
      return;
    }

    // Reset customer image when starting camera
    this.customer.customerImage = '';

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false }).then((stream) => {
      this.stream = stream;
      this.isCameraActive = true;
      this.webcamError = '';

      // Force change detection to ensure video element is rendered
      this.cdr.detectChanges();

      const video = this.videoPreview?.nativeElement;
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch((err) => {
            console.error('Video play error:', err);
            this.webcamError = 'Unable to play video stream.';
          });
        };
      }
    }).catch((error) => {
      console.error('Unable to access webcam', error);
      this.webcamError = 'Unable to access the webcam. Please allow camera permissions.';
      this.isCameraActive = false;
    });
  }

  takeSnapshot(): void {
    const video = this.videoPreview?.nativeElement;
    const canvas = this.captureCanvas?.nativeElement;

    if (!video || !canvas) {
      return;
    }

    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.customer.customerImage = canvas.toDataURL('image/png');

    // Stop camera after taking snapshot
    this.stopWebcam();
  }

  toggleWebcamMaximize(): void {
    this.isWebcamMaximized = !this.isWebcamMaximized;
  }

  stopWebcam(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.isCameraActive = false;
    this.isWebcamMaximized = false;
  }

  calculateTotal(): void {
    this.totalAmount = this.reservationList.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    this.totalCharges = this.reservationList.reduce((sum, item) => sum + Number(item.room?.roomCharges || 0), 0);
    this.balanceAmount = this.totalCharges - this.totalAmount;
  }

  private getSelectedPaymentAccount(paymentAccountId: string | null | undefined): any {
    if (!paymentAccountId) {
      return null;
    }

    const normalizedId = String(paymentAccountId);
    return this.paymentAccountList.find((account: any) => String(account.paymentAccountId) === normalizedId) || null;
  }

  private getDefaultOnlinePaymentAccount(): any {
    return this.paymentAccountList.find((account: any) => {
      const upiId = account?.upiId || account?.paymentAccount?.upiId || '';
      return !!upiId;
    }) || null;
  }

  onPaymentTypeChange(selected: any): void {
    console.log('Payment type changed:', selected);

    if (selected === 'CASH') {
      this.paymentAccountId = '';
      this.paymentType = 'CASH';
      this.hotelPaymentGatewayId = '';
      this.isOnlinePaymentSelected = false;
      this.upiId = '';
      this.qrCodeUrl = '';
      return;
    }

    const normalizedSelected = typeof selected === 'object' && selected !== null ? selected : null;
    const selectedPaymentId = normalizedSelected?.paymentAccountId || this.paymentAccountId || '';
    const selectedPaymentAccount = this.getSelectedPaymentAccount(selectedPaymentId) || this.getDefaultOnlinePaymentAccount();
    const paymentAccountName = selectedPaymentAccount?.paymentAccountName || selectedPaymentAccount?.hotelPaymentGateway?.paymentGateway?.paymentGatewayName || '';
    const gatewayName = selectedPaymentAccount?.hotelPaymentGateway?.paymentGateway?.paymentGatewayName || normalizedSelected?.hotelPaymentGateway?.paymentGateway?.paymentGatewayName || '';
    const moneyTransferAccount = normalizedSelected || selectedPaymentAccount;

    this.paymentAccountId = selectedPaymentAccount?.paymentAccountId || selectedPaymentId || '';
    this.hotelPaymentGatewayId = selectedPaymentAccount?.hotelPaymentGateway?.hotelPaymentGatewayId || normalizedSelected?.hotelPaymentGateway?.hotelPaymentGatewayId || '';
    this.upiId = moneyTransferAccount?.upiId || moneyTransferAccount?.paymentAccount?.upiId || '';
    this.paymentType = selected === 'ONLINE' || !!this.upiId ? 'ONLINE' : (this.hotelPaymentGatewayId || 'ONLINE');

    const isOnlineGateway = selected === 'ONLINE' || !!this.upiId || /online|upi|phonepe|gpay|qr/i.test(gatewayName || paymentAccountName) || /online|upi|qr/i.test(String(this.paymentAccountId || ''));
    this.isOnlinePaymentSelected = isOnlineGateway;

    if (!this.isOnlinePaymentSelected) {
      this.qrCodeUrl = '';
      return;
    }

    if (!this.upiId && !this.paymentAccountId && this.paymentAccountList.length > 0) {
      const fallbackAccount = this.getDefaultOnlinePaymentAccount();
      this.paymentAccountId = fallbackAccount?.paymentAccountId || '';
      this.hotelPaymentGatewayId = fallbackAccount?.hotelPaymentGateway?.hotelPaymentGatewayId || '';
      this.upiId = fallbackAccount?.upiId || fallbackAccount?.paymentAccount?.upiId || '';
    }

    this.buildOnlinePaymentQrCode();
  }

  addRoom(): void {
    this.reservationList.push({
      room: null,
      reservationId: '',
      checkIn: '',
      checkOut: '',
      amount: 0
    });
  }

  removeRoom(index: number): void {
    if (this.reservationList.length > 1) {
      this.reservationList.splice(index, 1);
      this.calculateTotal();
    }
  }

  compareRoomById(room1: any, room2: any): boolean {
    return room1 && room2 ? room1.roomId === room2.roomId : room1 === room2;
  }

  onRoomChange(index: number): void {
    const room = this.reservationList[index].room;
    if (room && room.roomCharges) {
      this.reservationList[index].amount = room.roomCharges;
    } else {
      this.reservationList[index].amount = 0;
    }
    this.calculateTotal();
  }

  makeAdditionalPayment(): void {
    // Calculate the balance amount
    const maxPayment = this.balanceAmount;
    const paymentAmount = prompt(`Enter additional payment amount (Max: ₹${maxPayment}):`, maxPayment.toString());
    
    if (paymentAmount && !isNaN(Number(paymentAmount))) {
      const amount = Number(paymentAmount);
      if (amount > 0 && amount <= maxPayment) {
        // Add to total amount
        this.totalAmount += amount;
        this.balanceAmount = this.totalCharges - this.totalAmount;
        this.submissionMessage = `Additional payment of ₹${amount} recorded successfully. Balance: ₹${this.balanceAmount}`;
        
        // Optionally, you could trigger a payment gateway call here for online payments
        if (this.paymentType !== 'CASH') {
          this.processOnlinePayment(amount);
        }
      } else {
        this.submissionMessage = 'Invalid payment amount. Please enter a value between 0 and ' + maxPayment;
      }
    }
  }

  processOnlinePayment(amount: number): void {
    this.buildOnlinePaymentQrCode();
    console.log('Processing online payment of:', amount);
  }

  buildOnlinePaymentQrCode(): void {
    const amount = Number(this.totalAmount || this.balanceAmount || 0);
    const selectedPaymentAccount = this.getSelectedPaymentAccount(this.paymentAccountId);
    const activeUpiId = (this.upiId
      || selectedPaymentAccount?.upiId
      || selectedPaymentAccount?.paymentAccount?.upiId
      || (this.paymentAccountList.length === 1 ? this.paymentAccountList[0]?.upiId : '')
      || '').trim();

    if (!amount || amount <= 0 || !activeUpiId) {
      this.qrCodeUrl = '';
      return;
    }

    const paymentPayload = `upi://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(this.payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Hotel Booking - Room reservation')}`;
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(paymentPayload)}`;
  }

  buildReservationPayload(): any {
    return {
      customer: {
        firstName: this.customer.firstName,
        lastName: this.customer.lastName,
        phoneNo1: this.customer.phoneNo1,
        middleName: this.customer.middleName,
        gender: this.customer.gender,
        phoneNo2: this.customer.phoneNo2,
        emailId: this.customer.emailId,
        doorNo: this.customer.doorNo,
        state: this.customer.state,
        idType: this.customer.idType,
        street: this.customer.street,
        country: this.customer.country,
        idValue: this.customer.idValue,
        city: this.customer.city,
        religion: this.customer.religion,
        occupation: this.customer.occupation,
        customerImage: this.customer.customerImage
      },
      reservationList: this.reservationList.map(reservation => ({
        room: {
          roomId: reservation.room?.roomId
        },
        checkIn: this.formatDateToBackend(reservation.checkIn),
        checkOut: this.formatDateToBackend(reservation.checkOut),
        amount: reservation.amount,
        totalAmount: this.totalAmount,
        paymentType: this.paymentType,
        paymentAccountId: this.paymentAccountId
      })),
      paymentAccount: {
        paymentAccountId: this.paymentAccountId
      },
      hotelPaymentGatewayId: this.hotelPaymentGatewayId,
      paymentType: this.isOnlinePaymentSelected ? 'ONLINE' : this.paymentType
    };
  }

  submitReservation(): void {
    const payload = this.buildReservationPayload();

    this.reservationService.createReservation(payload).subscribe({
      next: (response) => {
        console.log('Reservation response', response);
        const responseBody = response.body;
        if (responseBody && typeof responseBody === 'string' && responseBody.includes('<form')) {
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(responseBody);
            newWindow.document.close();
            this.submissionMessage = 'Redirecting to payment gateway...';
          } else {
            this.submissionMessage = 'Please allow popups to complete payment.';
          }
        } else {
          this.submissionMessage = 'Reservation saved successfully.';
          console.log('Reservation submitted', this.customer, this.reservationList, this.paymentType);
        }
      },
      error: (error) => {
        console.error('Reservation submission failed', error);
        this.submissionMessage = 'Reservation submission failed. Please try again.';
      }
    });
  }

  completeOnlinePayment(): void {
    this.isOnlinePaymentSelected = true;
    this.paymentType = 'ONLINE';
    this.submissionMessage = 'Payment successful. Booking is being confirmed...';

    this.submitReservation();

    setTimeout(() => {
      this.router.navigate(['/room'], {
        state: {
          paymentStatus: 'success',
          message: 'Payment successful and room booked.'
        }
      });
    }, 500);
  }

  private formatDateToBackend(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  }

  onSubmit(): void {
    if (this.isOnlinePaymentSelected) {
      this.buildOnlinePaymentQrCode();
      this.submissionMessage = 'Scan the QR code to complete payment. After the payment is done, click “I have paid”.';
      return;
    }

    this.submitReservation();
  }

  ngOnDestroy(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
  }
}
