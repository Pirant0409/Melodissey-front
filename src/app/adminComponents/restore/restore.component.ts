import { Component } from '@angular/core';
import { TMDBService } from '../../services/tmdb.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-restore',
  imports: [ReactiveFormsModule,Message],
  templateUrl: './restore.component.html',
  styleUrl: './restore.component.scss'
})
export class RestoreComponent {

  message = "Wrong file"
    showMessage = false
    constructor(private tmdbService: TMDBService) { }
    
    jsonForm = new FormGroup({
      file: new FormControl('')});
  
    onSubmit() {
      const fileInput = (document.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];
      console
      if (fileInput) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          try {
            const json = JSON.parse(fileReader.result as string);
            this.tmdbService.restoreDB(json).subscribe((response) => {
              if (response.status === 200) {
                this.message = "Database restored"
                this.showMessage = true
              } else {
                this.message = "Wrong file"
                this.showMessage = true
              }
            });
          } catch (error) {
            console.error('Invalid JSON file');
          }
        };
        fileReader.readAsText(fileInput);
      } else {
        console.error('No file selected');
      }
    }

}
