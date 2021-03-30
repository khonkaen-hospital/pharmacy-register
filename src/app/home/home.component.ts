import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { QueueService } from '../shared/queue.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { BehaviorSubject } from 'rxjs';

const remote = window.require('@electron/remote');
const { PosPrinter } = remote.require("electron-pos-printer");
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

    const webContents = remote.getCurrentWebContents();
    const printers = webContents.getPrinters();
    console.log('printers', printers);

    const options = {
      preview: false, // Preview in window or print
      width: '140px', //  width of content body
      margin: "0 0 0 0", // margin of content body
      copies: 1, // Number of copies to print
      printerName: '', // printerName: string, check it at webContent.getPrinters()
      timeOutPerLine: 400,
      silent: true,
    };
    const data = [{
      type: "text",
      value: "ทดสอบครับ",
      style: `text-align:center;`,
      css: { "font-size": "12px", "font-family": "sans-serif" },
    }];

    PosPrinter.print(data, options)
      .then(() => { })
      .catch((error) => {
        console.error(error);
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
