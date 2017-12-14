import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GRequest, ExpandedRequest} from "../../interfaces/request";
import {mockexpandedRequest} from "../../../../tempData/mockData";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnChanges {
  @Input() Rhistory: ExpandedRequest;
  @Input() Ghistory: ExpandedRequest;
  @Input() request: GRequest;
  @Input() todel_state: any;
  @Input() userType: any;
  history: any[];
  statusGraph: string="../../../assets/images/progress2.png";

  // myMockHistory: any = {
  //   user: [
  //     {
  //     text: 'הוגשה בקשה ע״י רונן ביזמן, נשלחה בהצלחה',
  //     date : '12.12.17'
  //     },
  //     {
  //       text: 'התקבל אישור קבלה בבנק, הועבר לטיפול פנימי',
  //       date : '19.12.17'
  //     },
  //     {
  //       text: 'דרושה חתימה על כתב שיפוי',
  //       date : '20.12.17'
  //     }
  //   ],
  //   bank: [
  //     {
  //       text: 'נוצרה ע״י א.ג אחזקות, איש קשר רונן ביזמן, נשלחה בהצלחה',
  //       date: '12.12.17'
  //     },
  //     {
  //       text: 'התקבלה בבנק, נדרשת פעולה',
  //       date: '19.12.17'
  //     }
  //   ],
  //   beneficiary: [
  //     {
  //       text:  'הונפקה ערבות ע״י הבנק',
  //       date: '12.12.17'
  //     },
  //     {
  //       text:  'אישור קבלה',
  //       date: '19.12.17'
  //     },
  //     {
  //       text: 'פעולות אפשריות',
  //       date: null
  //     }
  //
  //   ]
  // };

  ngOnChanges(changes: SimpleChanges){
    if((!isNullOrUndefined(this.Rhistory) && changes.Rhistory.currentValue !== changes.Rhistory.previousValue)
  ||
      (!isNullOrUndefined(this.Ghistory) && changes.Ghistory.currentValue !== changes.Ghistory.previousValue))
  {
      this.parseHistoryData();
      console.log('this.Rhistory', this.Rhistory);
      if(this.todel_state==1) {
        this.statusGraph="../../../assets/images/progress1.png";
      } else {
        this.statusGraph="../../../assets/images/progress2.png";
      }
    }
  }

  parseHistoryData() {
    if(!isNullOrUndefined(this.Rhistory) && !isNullOrUndefined(this.Rhistory.log)) {
      // console.log('parseHistoryData this.history',this.Rhistory.log);
      this.history = this.Rhistory.log.map(item => {
        return item.date + "    " + item.comment + " "+ item.eventname;
      });
    }
    console.log('this.history', this.history);
    if(!isNullOrUndefined(this.Ghistory) && !isNullOrUndefined(this.Ghistory.log)) {
      console.log('parseHistoryData this.history',this.Ghistory.log);
      this.history = this.Ghistory.log.map(item => {
        return item.date + "    " + item.comment + " "+ item.eventname;
      });
    }
  }
}
