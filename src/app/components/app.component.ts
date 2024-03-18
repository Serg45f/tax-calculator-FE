import { Component } from '@angular/core';
import { TaxSalaryResult } from '../models/tax-salary-result';
import { TaxSalaryService } from '../services/tax-salary.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TAX CALCULATOR';

  annualSalary: number = 0;
  taxSalaryResult: TaxSalaryResult;
  isInput = false;
  taxSalaryResults: any;

  constructor(private taxSalaryService: TaxSalaryService) {
  }
  
  onSubmit(data: NgForm) {
    console.log(data);
  }

  result = () => {
    console.log(this.annualSalary);
    this.taxSalaryService.getResult(this.annualSalary).subscribe( res => {
      this.taxSalaryResult = res;
      if(this.taxSalaryResult) this.isInput = true;
    });
  }

  
  
}
