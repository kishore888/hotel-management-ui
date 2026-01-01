import { NgModule } from '@angular/core';
import { ChatbotComponent } from './chatbot.component';

@NgModule({
  declarations: [],
  imports: [
    ChatbotComponent // ✅ import standalone component
  ],
  exports: [ChatbotComponent]  // ✅ export it for use in AppModule
})
export class ChatbotModule { }
