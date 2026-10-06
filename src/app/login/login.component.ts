import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  data: any = {
    email: 'user1@example.com',
    password: '123abcABC',
    isRememberMe: false
  };

  origClass = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.origClass = document.body.className;
    document.body.className = 'bg-gradient-primary';
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      // Fixed client-side demo marker only; no credentials are authenticated.
      localStorage.setItem('token', 'demo-session');
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    }
  }

  ngOnDestroy(): void {
    document.body.className = this.origClass;
  }

}
