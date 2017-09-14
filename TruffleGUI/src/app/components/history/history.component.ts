import {Component, Input, OnInit} from '@angular/core';
import {GRequest} from "../../interfaces/request";
import {mockexpandedRequest} from "../../../../tempData/mockData";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @Input() history: any[];
  @Input() request: GRequest;
  @Input() userType: any;
  myHistory: any[];

  myMockHistory: any = {
    user: [
      {
      text: 'הוגשה בקשה ע״י רונן ביזמן, נשלחה בהצלחה',
      date : '12.12.17'
      },
      {
        text: 'התקבל אישור קבלה בבנק, הועבר לטיפול פנימי',
        date : '19.12.17'
      },
      {
        text: 'דרושה חתימה על כתב שיפוי',
        date : '20.12.17'
      }
    ],
    bank: [
      {
        text: 'נוצרה ע״י א.ג אחזקות, איש קשר רונן ביזמן, נשלחה בהצלחה',
        date: '12.12.17'
      },
      {
        text: 'התקבלה בבנק, נדרשת פעולה',
        date: '19.12.17'
      }
    ],
    beneficiary: [
      {
        text:  'הונפקה ערבות ע״י הבנק',
        date: '12.12.17'
      },
      {
        text:  'אישור קבלה',
        date: '19.12.17'
      },
      {
        text: 'פעולות אפשריות',
        date: null
      }

    ]
  };

  ngOnInit() {
  //   if(this.request){
  //     this.myHistory = this.getHistory(this.request.GRequestID)
  //   } else {
  //     this.myHistory = [...this.history];
  //   }
  }

  getHistory(id): any[] {
    // TODO - add real function
    return mockexpandedRequest[1].log;
  }
}
