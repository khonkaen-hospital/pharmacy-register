import { Component, OnInit, ViewChild, ElementRef, ɵSafeHtml } from '@angular/core';
import { Router } from '@angular/router';
import { QueueService } from '../shared/queue.service';
import { ElectronService } from '../core/services/electron/electron.service';
import { BehaviorSubject } from 'rxjs';
import QRCode from 'qrcode';
import * as JsBarcode from 'jsbarcode';

type barcodeType = 'CODE128' | 'CODE128A' | 'CODE128B' | 'CODE128C' | 'EAN13' | 'UPC' | 'EAN8' | 'EAN5' | 'EAN2' | 'CODE39' | 'ITF14' | 'MSI' | 'MSI10' | 'MSI11' | 'MSI1010' | 'MSI1110' | 'pharmacode' | 'codabar' | 'CODE128';
const remote = window.require('@electron/remote');
const BrowserWindow = remote.BrowserWindow;

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
      this.print();
    }
  }


  async print(): Promise<void> {

    const options = {
      silent: false,
      printBackground: true,
      color: false,
      margin: {
        marginType: 'printableArea'
      },
      landscape: false,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      header: 'Header of the Page',
      footer: 'Footer of the Page'
    };
    const win = new BrowserWindow({
      show: true,
      width: 250,
      webPreferences: {
        nodeIntegration: true
      }
    });

    const qr = await QRCode.toDataURL('10670#KCEQAR8YU1MTD9LRLFDF#49019259#997#7724#7724#20210330#0800#ห้องยา OPD ชั้น 1#ผู้ป่วยทั่วไป');
    const barcode = this.barcodeToBase64Barcode('52298168');

    const html = `<!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Eziosk</title>
      <style>
        body{
          text-align:center;
        }
        #invoice-POS .sub-header{
          margin:10px 0 3px 0;
        }

        #invoice-POS {
          padding: 2mm;
          margin: 0 auto;
          background: #FFF;
        }

        #invoice-POS ::selection {
          background: #f31544;
          color: #FFF;
        }

        #invoice-POS ::moz-selection {
          background: #f31544;
          color: #FFF;
        }

        #invoice-POS h1 {
          font-size: 1.5em;
          color: #222;
          margin-bottom:5px;
        }

        #invoice-POS h2 {
          margin-top:0;
          font-size: 0.9em;
        }

        #invoice-POS h5 {
          margin:0;
          font-size: 3em;
        }

        #invoice-POS h3 {
          font-size: 1.2em;
          font-weight: 300;
          line-height: 2em;
        }

        #invoice-POS p {
          font-size: 0.7em;
          color: #666;
          line-height: 1.2em;
        }

        #invoice-POS #top,
        #invoice-POS #mid,
        #invoice-POS #bot {
          /* Targets all id with 'col-' */
          border-bottom: 1px solid #EEE;
        }

        #invoice-POS #top {
          min-height: 100px;
        }

        #invoice-POS #mid {
          min-height: 80px;
        }

        #invoice-POS #bot {
          min-height: 50px;
        }

        #invoice-POS #top .logo {
          height: 60px;
          width: 60px;
          background: url() no-repeat;
          background-size: 60px 60px;
        }

        #invoice-POS .clientlogo {
          float: left;
          height: 60px;
          width: 60px;
          background: url() no-repeat;
          background-size: 60px 60px;
          border-radius: 50px;
        }

        #invoice-POS .info {
          display: block;
          margin-left: 0;
        }

        #invoice-POS .queue {
          border: solid 1px #000;
        }

        #invoice-POS .title {
          float: right;
        }

        #invoice-POS .title p {
          text-align: right;
        }

        #invoice-POS table {
          width: 100%;
          border-collapse: collapse;
        }

        #invoice-POS .tabletitle {
          font-size: 0.5em;
          background: #EEE;
        }

        #invoice-POS .service {
          border-bottom: 1px solid #EEE;
        }

        #invoice-POS .item {
          width: 24mm;
        }

        #invoice-POS .itemtext {
          font-size: 0.5em;
        }

        #invoice-POS #legalcopy {
          margin-top: 5mm;
        }
      </style>
    </head>

    <body>

      <div id="invoice-POS">

        <center id="top">

          <div class="info">
            <h1>ห้องจ่ายยา</h1>
            <h2>โรงพยาบาลขอนแก่น</h2>
          </div>
          <div class="queue">
          <h5>4578</h5>
          <h2>หมายเลขรับยา (ไม่ใช่บัตรคิว)</h2>
          </div>


          <!--End Info-->
        </center>
        <!--End InvoiceTop-->

        <div id="mid">
          <div class="info">
            <p class="sub-header">ชื่อ-สกุล</p>
            <h2>สาธิต สีถาพล</h2>
            <p class="sub-header">หมายเลขประจำตัวผู้ป่วย</p>
            <h2>52298168</h2>
          </div>
        </div>

        <!--End Invoice Mid-->

        <div id="bot">
        <p>วันที่ 31 มีนาคม 2563 10:49</p>
        <p style="text-align:center; " class="legal"><strong>โปรเก็บเอกสารนี้ไว้เพื่อติดต่อรับยา!</strong></p>
        </div>
          <!--End Table-->

          <div id="legalcopy">

            <img style="width:100%" src="${qr}" />
          </div>

        </div>
        <!--End InvoiceBot-->
      </div>
      <!--End Invoice-->

    </body>

    </html>`;

    const url = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
    win.loadURL(url);

    win.webContents.on('did-finish-load', () => {
      win.webContents.print(options, (success, failureReason) => {
        if (!success) console.log(failureReason);
        console.log('Print Initiated');
      });
    });
  }

  barcodeToBase64Barcode(text: string, format: barcodeType = 'CODE39'): string {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: format, height: 50 });
    return canvas.toDataURL("image/png");
  }


}
