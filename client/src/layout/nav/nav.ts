import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit{
  // injecting the account-service
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected creds: any = {}
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light'); 
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectedTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    // Setting the theme through Daisy UI
    document.documentElement.setAttribute('data-theme', theme)
    // hiding the theme selection dropdown after a theme has been selected (clicked), this is how its done in Daisy UI
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toast.success("Successfully Logged in")
        this.creds = {};
      },
      error: error => this.toast.error(error.error)
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
