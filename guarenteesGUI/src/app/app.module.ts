import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { GuaranteeViewComponent } from './guarantee-view/guarantee-view.component';
import { RequestItemComponent } from './request-item/request-item.component';
import { GuaranteeFormComponent } from './guarantee-form/guarantee-form.component';
import { FilterByKeyValuePipe } from './filter-by-key-value.pipe';
import { RequestDetailsComponent } from './request-details/request-details.component';
import {DialogModule, FileUploadModule, SelectButtonModule, TabViewModule} from 'primeng/primeng';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    GuaranteeViewComponent,
    RequestItemComponent,
    GuaranteeFormComponent,
    FilterByKeyValuePipe,
    RequestDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TabViewModule,
    DialogModule,
    FileUploadModule,
    SelectButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
