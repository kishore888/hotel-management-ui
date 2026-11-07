import { Component, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReservationService } from './reservation.service';
import { HotelPaymentGatewayService } from '../../payment/hotel-payment-gateway/hotel-payment-gateway.service';
import { PaymentAccountService } from '../../payment/payment-account/payment-account.service';

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
  // hotelPaymentGatewayList: Array<any> = [];
  paymentAccountList: Array<any> = [];
  isCameraActive = false;
  webcamError = '';
  submissionMessage = '';
  isWebcamMaximized = false;
  private stream: MediaStream | null = null;

  constructor(private reservationService: ReservationService, private cdr: ChangeDetectorRef, private hotelPaymentGatewayService: HotelPaymentGatewayService,
    private paymentAccountService: PaymentAccountService
  ) {}

  ngOnInit(): void {
    const navRoom = (history.state && history.state['room']) ? history.state['room'] : null;
    if (navRoom) {
      // If reservationList is empty, create a new reservation object
      if (this.reservationList.length === 0) {
        this.reservationList.push({
          room: navRoom,
          reservationId: '',
          checkIn: '',
          checkOut: '',
          amount: navRoom.roomCharges || 0
        });
      } else {
        // Assign navRoom to the first reservation's room
        this.reservationList[0].room = navRoom;
        this.reservationList[0].amount = navRoom.roomCharges || 0;
      }
    } else {
      console.warn('No room data found in navigation state');
    }

    this.calculateTotal();

    // // Load hotel payment gateways
    // if (this.hotelPaymentGatewayService) {
    //   this.hotelPaymentGatewayService.getHotelPaymentGateways().subscribe({
    //     next: (gateways) => {
    //       this.hotelPaymentGatewayList = gateways || [];
    //     },
    //     error: (error) => {
    //       console.error('Failed to load payment gateways', error);
    //       this.hotelPaymentGatewayList = [];
    //     }
    //   });
    // }
    
    // Load payment accounts
    if (this.paymentAccountService) {
      this.paymentAccountService.getPaymentAccounts().subscribe({
        next: (accounts) => {
          console.log('Payment accounts loaded:', accounts);
          this.paymentAccountList = accounts || [];
        },
        error: (error) => {
          console.error('Failed to load payment accounts', error);
          this.paymentAccountList = [];
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
  }

  onPaymentTypeChange(selected: any): void {
    console.log('Payment type changed:', selected);
    if (selected === 'CASH') {
      this.paymentAccountId = '';
      this.paymentType = 'CASH';
    } else {
      console.log('Payment type paymentAccountId:', selected.paymentAccountId);
    console.log('Payment type hotelPaymentGatewayId:', selected.hotelPaymentGateway.hotelPaymentGatewayId);
      this.paymentAccountId = selected.paymentAccountId;
      this.paymentType = 'online';
      this.hotelPaymentGatewayId = selected.hotelPaymentGateway.hotelPaymentGatewayId;
    }
  }

  private formatDateToBackend(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  }

  onSubmit(): void {
    const payload = {
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
      paymentType: this.paymentType
    };

    this.reservationService.createReservation(payload).subscribe({
      next: (response) => {
        console.log('Reservation response', response);
        // Check if response is HTML (PayU payment form)
        const responseBody = response.body;
        if (responseBody && typeof responseBody === 'string' && responseBody.includes('<form')) {
          // Open PayU payment in a new window
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

  ngOnDestroy(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
  }
}
