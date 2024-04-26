import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  files: File[] = [];
  imageUrls: string[] = [];

  email: string = '';
  username: string = '';
  password: string = '';


  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  async upload() {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const path = `images/${file.name}`;
      const uploadTask = await this.storage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      this.imageUrls.push(url);
      alert("File Uploaded Successfully !!")
      this.router.navigate(['/home'])
    }

    this.storeFormData();
    
    const inputElement = document.getElementById('formFile') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }

    this.files = [];
  }

  storeFormData() {
    this.firestore.collection('formData').add({
      email: (document.getElementById('email') as HTMLInputElement).value,
      username: (document.getElementById('username') as HTMLInputElement).value,
      password: (document.getElementById('password') as HTMLInputElement).value,
    })
    .then(() => {
      console.log('Form data stored successfully in Firestore.');
    })
    .catch((error) => {
      console.error('Error storing form data:', error);
    });
  }
}
