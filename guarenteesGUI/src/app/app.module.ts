import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { GuaranteeViewComponent } from './guarantee-view/guarantee-view.component';
import { RequestItemComponent } from './request-item/request-item.component';
import { GuaranteeItemComponent } from './guarantee-item/guarantee-item.component';
import { GuaranteeFormComponent } from './guarantee-form/guarantee-form.component';
import { FilterByKeyValuePipe } from './filter-by-key-value.pipe';
import { RequestDetailsComponent } from './request-details/request-details.component';
import {TabViewModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    GuaranteeViewComponent,
    RequestItemComponent,
    GuaranteeItemComponent,
    GuaranteeFormComponent,
    FilterByKeyValuePipe,
    RequestDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TabViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
