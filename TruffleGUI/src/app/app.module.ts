import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {
  AccordionModule,
  DialogModule, DropdownModule, FileUploadModule, GrowlModule, SharedModule,
} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {GuaranteeViewComponent} from "./components/guarantee-view/guarantee-view.component";
import {RequestItemComponent} from "./components/request-item/request-item.component";
import {RequestDetailsComponent} from "./components/request-details/request-details.component";
import {GuaranteeFormComponent} from "./components/guarantee-form/guarantee-form.component";
import {FilterByKeyValuePipe} from "./pipes/FilterByKeyValue/filter-by-key-value.pipe";
import { ParseDatePipe } from './pipes/ParseDate/parse-date.pipe';
import {FourDigitsPipe} from "./pipes/FourDigits/four-digits.pipe";
import { WizardComponent } from './components/wizard/wizard.component';
import {MessageService} from "primeng/components/common/messageservice";
import { HistoryComponent } from './components/history/history.component';
import {ActionsComponent} from "./components/actions/actions.component";
import {AccordionContentComponent} from "./components/accordion-content/accordion-content.component";
import {StatusIconComponent} from "./components/status-icon/status-icon.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DialogModule,
    FileUploadModule,
    DropdownModule,
    GrowlModule,
    AccordionModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    GuaranteeViewComponent,
    RequestItemComponent,
    RequestDetailsComponent,
    GuaranteeFormComponent,
    FilterByKeyValuePipe,
    ParseDatePipe,
    FourDigitsPipe,
    WizardComponent,
    HistoryComponent,
    ActionsComponent,
    AccordionContentComponent,
    StatusIconComponent
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
