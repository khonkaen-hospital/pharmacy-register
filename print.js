"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintSlip = void 0;
var electron_pos_printer_1 = require("electron-pos-printer");
function PrintSlip(printerName) {
    console.log(printerName);
    var options = {
        preview: false,
        width: '170px',
        margin: '0 0 0 0',
        copies: 1,
        printerName: printerName,
        timeOutPerLine: 400,
        pageSize: { height: 301000, width: 71000 } // page size
    };
    var data = [
        {
            type: 'text',
            value: 'SAMPLE HEADING',
            style: "text-align:center;",
            css: { "font-weight": "700", "font-size": "18px" }
        }
    ];
    electron_pos_printer_1.PosPrinter.print(data, options)
        .then(function () {
        console.log('print');
    })
        .catch(function (error) {
        console.error(error);
    });
}
exports.PrintSlip = PrintSlip;
//# sourceMappingURL=print.js.map