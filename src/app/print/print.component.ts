import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  elRef: ElementRef;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  getContent(): string {
    return this.elRef.nativeElement.innerHTML;
  }

}
