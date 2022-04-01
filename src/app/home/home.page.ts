import { AvatarService } from './../services/avatar.service';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { ModalPage } from './../modal/modal.page';
import { DataService } from './../services/data.service';
import { Component } from '@angular/core';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;
  notes = [];
  constructor(
    private dataService : DataService,
    private avatarService : AvatarService,
    private alertController : AlertController,
    private modalController : ModalController,
    private loadingController : LoadingController,
    private authService : AuthService,
    private router : Router
  ) {

    this.avatarService.getUserProfile().subscribe(data => {
      this.profile = data;
    })


    this.dataService.getNoteTypeAnnouncement().subscribe(res => {
      // console.log(res);
      this.notes = res;
    })


    // this.onChange([]);
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });

    console.log(image)

    if(image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if(!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem in uploading',
          buttons: ['OK']
        });
        await alert.present();
      }
    }

  }

 async openNote(note) {
  const modal  = await this.modalController.create({
    component: ModalPage,
    componentProps: { id: note.id},
    breakpoints: [0,0.5, 0.8],
    initialBreakpoint: 0.6
  });
  await modal.present();
  }

  async addNote() {
    const alert = await this.alertController.create({
      header: 'Add note',
      inputs: [
        {
          name: 'title',
          placeholder: 'My note',
          type: 'text'
        },
        {
          name: 'text',
          placeholder: 'Kinetic',
          type: 'textarea'
        },
        {
          name: 'type',
          placeholder: 'Enter type',
          type: 'text'
        },
        {
          name: 'createdAt',
          placeholder: 'created At',
          type: 'date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (res) => {
            this.dataService.addNote({title: res.title, text: res.text, createdAt:res.createdAt, type: res.type})
          }
        }
      ]
    });
    await alert.present();
  }
  

  filterProductData(event: any) {
    this.dataService.getNotes().subscribe((res) => {
      this.notes = res;
      const val = event.target.value;
      if(val && val.trim() !== '') {
        this.notes = this.notes.filter((notesFilter) => {
          return (notesFilter.title.toLowerCase().indexOf(val.toLowerCase()) >-1)
        })
      }
    })
  }

  // onChange(_value) {
  //   if(!_value.length) {
  //     return this.dataService.getNotes().subscribe((res) => {
  //       this.notes  = res;
  //     })
  //   }

  //   this.notes = this.notes.filter((i) => {
  //     return _value.indexOf(i.type) !==1
  //   }) 
  // }

 async logout() {
  await  this.authService.logout();
  this.router.navigateByUrl('/', {replaceUrl: true})
  }

}
