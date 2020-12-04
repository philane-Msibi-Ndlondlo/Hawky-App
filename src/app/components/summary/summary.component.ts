import { Component, OnInit } from '@angular/core';
import { TimeService } from 'src/app/services/time.service';
import { AuthService } from 'src/app/services/auth.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { Router } from '@angular/router';

// define interface for jspdf-autotable

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  timetable: any[] = [];
  user = null;
  username = null;
  timetablepdf: any[] = [];

  constructor(private time: TimeService, private auth: AuthService, private route: Router) { }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.username = this.user.firstname + ' ' + this.user.lastname;
    this.time.getTimetable(this.user.email).subscribe(timetable => {
      this.timetable = timetable.message;
      this.timetable.forEach((timeRow, i) => {
      this.timetablepdf.push({days: timeRow.dayDate, attendance: 'Yes', internsignature: 'Signed', timein: timeRow.timeIn, timeout: timeRow.timeOut});
    });
      console.log('this.timetable', this.timetablepdf);
    });

  }

  logout() {
    this.auth.logOut();
    this.route.navigate(['/']);
  }

  downloadPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4');
    const months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];

    doc.setFontSize(12);
    doc.text('Attendance Register', 30, 40);
    doc.text(`Name of employee: ${this.username}`, 30, 60);
    doc.text(`Month: ${months[new Date().getMonth()]} ${new Date().getFullYear()}`, 30, 80);
    doc.text('PAYROLL WILL RUN FROM THE 1st - 31st', 240, 80);
    doc.line(30, 42, 110, 42);

    doc.autoTable({


      margin: {top: 100},
      body: this.timetablepdf,
      columns: [
        { header: 'Days', dataKey: 'days' },
        { header: 'Attendance', dataKey: 'attendance' },
        { header: 'Interns Signature', dataKey: 'internsignature' },
        { header: 'Time in', dataKey: 'timein' },
        { header: 'Time out', dataKey: 'timeout' }
      ]
    });

    doc.text(`Line Manager's Signature: `, 30, 600);
    doc.line(30, 604, 410, 604);

    doc.save(`${this.username}-${new Date().toDateString().toString()}-timetable.pdf`);
  }


}
