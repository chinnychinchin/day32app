import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  buttonText = 'Join'
  messages = []
  connectionForm: FormGroup
  constructor(private fb: FormBuilder, private chatSvc: ChatService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.connectionForm = this.fb.group({

      username: this.fb.control(''),
      message: this.fb.control('')

    })
  }

  toggleConnection() {

    const name = this.connectionForm.value['username']
    if(this.buttonText == 'Join'){
      this.buttonText = "Leave"
      this.chatSvc.join(name)
      this.chatSvc.event.subscribe(
        (chat) =>
          this.messages.unshift(chat)
      )
    }
    else{
      this.buttonText = 'Join';
      this.chatSvc.leave()
    }

  }

  sendMsg() {

    const msg = this.connectionForm.value['message']
    this.chatSvc.sendMsg(msg)
  }

}
