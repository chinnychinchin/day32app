import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface ChatMessage {
    from?: string,
    message: string, 
    timestamp?: string
}

@Injectable()
export class ChatService {

    constructor(private http: HttpClient) {}

    private sock: WebSocket
    // create an event listener
    event = new Subject<ChatMessage>()

    join(name: string) {

        const params = new HttpParams().set('name', name)
        this.sock = new WebSocket(`ws://localhost:3000/chat?${params}`)
        this.sock.onmessage = (payload: MessageEvent) => {

            const chat = JSON.parse(payload.data) as ChatMessage;
            //fire off the event
            this.event.next(chat)

        }
        //if server closes down or if connection is lost unexpectedly
        this.sock.onclose = () => {
            if(this.sock != null) {
                this.sock.close()
                this.sock = null
            }
            
        }
    }

    leave() {

        if(this.sock !=null) {
            this.sock.close();
            this.sock = null
        }
    }

    sendMsg(msg: string) {
        this.sock.send(msg)
    }
    
}