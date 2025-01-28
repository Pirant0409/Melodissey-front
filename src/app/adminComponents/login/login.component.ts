import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TMDBService } from '../../services/tmdb.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';

@Component({
    standalone: true,
    selector: 'app-admin',
    imports: [ReactiveFormsModule, Message],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

  message = "Login failed"
  showMessage = false
  constructor(private tmdbService: TMDBService) { }
  
  loginForm = new FormGroup({
    password: new FormControl('')});

  onSubmit() {
    let password = this.loginForm.value.password;
    if (password != null && password != undefined ) {
      this.tmdbService.login(password).subscribe(response => {
        console.log(response)
        if (response.status == 200) {
          localStorage.setItem('token', response.token);
          window.location.href = "/admin/days";
        } 
        else {
          this.message = response.detail,
          this.showMessage = true
        }
      });
    }
  }
    
}
