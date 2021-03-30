
import { PosPrinter, PosPrintData, PosPrintOptions } from "electron-pos-printer";
import * as path from "path";

export function PrintSlip(printerName: string): void {
  console.log(printerName);
  const options: PosPrintOptions = {
    preview: false,
    width: '170px',
    margin: '0 0 0 0',
    copies: 1,
    printerName: printerName,
    timeOutPerLine: 400,
    pageSize: { height: 301000, width: 71000 } // page size
  }

  const data: PosPrintData[] = [
    {
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: 'SAMPLE HEADING',
      style: `text-align:center;`,
      css: { "font-weight": "700", "font-size": "18px" }
    }
  ]
  PosPrinter.print(data, options)
    .then(() => {
      console.log('print');
    })
    .catch((error) => {
      console.error(error);
    });

}
