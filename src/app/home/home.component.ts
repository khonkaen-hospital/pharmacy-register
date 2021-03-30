import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { QueueService } from '../shared/queue.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('input') input: ElementRef;
  barcode: string;
  barcodeSubject: BehaviorSubject<boolean>;
  hn: string;
  timer: any;
  isFocus: boolean;
  isManual: boolean;
  isReady: boolean;

  constructor(
    private router: Router,
    private queueService: QueueService,
    public electronService: ElectronService
  ) { }

  ngOnInit(): void {
    this.setFocus();
    this.barcode = '';
    this.barcodeSubject = new BehaviorSubject<boolean>(false);
    this.barcodeSubject.asObservable().subscribe(value => {
      console.log(value);
      this.isReady = value === true ? true : false;
    });
  }

  registerQueue(event: KeyboardEvent | any): void {
    console.log(event);
    this.delaySearch();
  }

  delaySearch(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.onSerch();
    }, 400);
  }

  setFocus(): void {
    setTimeout(() => {
      const ele = this.input.nativeElement;
      ele.focus();
      this.isFocus = true;
      console.log(this.isFocus);
    }, 50);
  }

  manualInput(): void {
    this.isManual = this.isManual === true ? false : true;
    this.reset();
    this.setFocus();
  }

  reset(): void {
    this.barcode = '';
    this.hn = '';
    this.barcodeSubject.next(false);
  }

  onSerch(): void {
    this.hn = this.barcode;
    console.log(this.hn);
    this.barcode = '';
  }

  delClick(): void {
    if (this.barcode.toString().length > 0) {
      this.barcode = this.barcode.toString().slice(0, -1);
      if (this.barcode.length < 8) {
        this.barcodeSubject.next(false);
      }
    }
  }

  onNumberClick(value: string): void {
    if (this.barcode.length < 8) {
      this.barcode = this.barcode + value;
    }
    if (this.barcode.length === 8) {
      this.barcodeSubject.next(true);
      this.hn = this.barcode;
    }

  }

  onConfirme(): void {
    if (this.isReady) {

    }
  }


}
