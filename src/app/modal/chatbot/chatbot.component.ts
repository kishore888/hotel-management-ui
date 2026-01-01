import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatbotService } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  imports: [CommonModule, MatIconModule, FormsModule]
})
export class ChatbotComponent {

  showPopup = false;

  userMessage = '';
  messages: { user: string; ai: string }[] = [];

  constructor(private ChatbotService: ChatbotService) {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    const userText = this.userMessage;
    this.messages.push({ user: userText, ai: '...' });
    this.userMessage = '';

    this.ChatbotService.sendMessage(userText).subscribe((response) => {
      this.messages[this.messages.length - 1].ai = response;
    });
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

}
