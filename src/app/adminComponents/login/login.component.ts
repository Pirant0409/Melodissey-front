import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TMDBService } from '../../services/tmdb.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'app-admin',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private tmdbService: TMDBService) { }
  loginForm = new FormGroup({
    password: new FormControl('')});

  onSubmit() {
    let password = this.loginForm.value.password;
    if (password != null && password != undefined ) {
      this.tmdbService.login(this.loginForm.value.password!).subscribe(response => {
        localStorage.setItem('token', response.token);
      });
    }
  }
    
}
