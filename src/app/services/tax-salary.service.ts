import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TaxSalaryResult } from "../models/tax-salary-result";
import { Observable, catchError, delay, retry, tap, throwError } from "rxjs";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: 'root'
})
export class TaxSalaryService {
        constructor(private http: HttpClient,
        private errorService: ErrorService) {
    }

    taxSalaryResults: TaxSalaryResult | undefined;

    getResult(salary: number): Observable<TaxSalaryResult> {
        return this.http.get<TaxSalaryResult>('http://localhost:8080/tax-calculator',
        {
            params: new HttpParams().append('annualSalary', salary)
        }).pipe(
            delay(200),
            retry(2),
            tap( taxSalaryResults => this.taxSalaryResults = taxSalaryResults),
            catchError(this.errorHandler.bind(this))
        )
    }

    private errorHandler(error:  HttpErrorResponse) {
        this.errorService.handle(error.message)
        return throwError(()=>error.message)
    }

}