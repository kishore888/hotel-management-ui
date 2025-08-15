import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';  
// import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-bootstrap',
  templateUrl: './modal-bootstrap.component.html',
  styleUrl: './modal-bootstrap.component.css',
  standalone: false
})
export class ModalBootstrapComponent implements OnInit{
  // constructor(public modalRef: MdbModalRef<ModalComponent>) {}
  // openModal() {
  //   const modal = new bootstrap.Modal(document.getElementById(''));
  //   modal.show();
  // }

  private modalService = inject(NgbModal);
  activeModal = inject(NgbActiveModal);
	closeResult = '';

  // @ViewChild('content', { static: true })
  // bookingTemplate!: TemplateRef<any>;

  ngOnInit(): void {
    // this.open(this.bookingTemplate);
    this.open();
    console.log("booking - modal");
  }
	open() {
		this.modalService.open({ ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  // open(content: TemplateRef<any>) {
	// 	this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
	// 		(result) => {
	// 			this.closeResult = `Closed with: ${result}`;
	// 		},
	// 		(reason) => {
	// 			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	// 		},
	// 	);
	// }

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}
