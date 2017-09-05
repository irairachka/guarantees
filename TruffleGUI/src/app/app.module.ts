import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {DialogModule, FileUploadModule, SelectButtonModule} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {GuaranteeViewComponent} from "./components/guarantee-view/guarantee-view.component";
import {RequestItemComponent} from "./components/request-item/request-item.component";
import {RequestDetailsComponent} from "./components/request-details/request-details.component";
import {GuaranteeFormComponent} from "./components/guarantee-form/guarantee-form.component";
import {FilterByKeyValuePipe} from "./pipes/FilterByKeyValue/filter-by-key-value.pipe";
import { ParseDatePipe } from './pipes/ParseDate/parse-date.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DialogModule,
    FileUploadModule,
    SelectButtonModule
  ],
  declarations: [
    AppComponent,
    GuaranteeViewComponent,
    RequestItemComponent,
    RequestDetailsComponent,
    GuaranteeFormComponent,
    FilterByKeyValuePipe,
    ParseDatePipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
