import { ModalController, ToastController } from '@ionic/angular';
import { DataService, Note } from './../services/data.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() id: string;
  note: Note = null;
  constructor(
    private dataService: DataService,
    private modalController : ModalController,
    private toastController : ToastController
  ) { }

  ngOnInit() {
    this.dataService.getNoteById(this.id).subscribe(res => {
      this.note = res;
    })
  }

  async updateNote() {
    this.dataService.updateNote(this.note)
    const toast = await this.toastController.create({
      message: 'Note Updated',
      duration: 1000
    });
    await toast.present()
  }

  async deleteNote() {
  await  this.dataService.deleteNote(this.note);
  this.modalController.dismiss();
  }

}
