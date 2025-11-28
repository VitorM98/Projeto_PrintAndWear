import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // Proxy → vira https://api.openai.com/v1/chat/completions
  private apiUrl = '/openai-api/v1/chat/completions';

  // ⚠️ COLOQUE SUA NOVA API KEY AQUI (mas o ideal é NÃO deixar no código)
  private apiKey = "SUA_API_KEY_AQUI";

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  // ENVIO DE TEXTO
  // -------------------------------------------------------
  sendMessage(message: string): Observable<any> {
    const body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: message }
      ]
    };

    return this.http.post<any>(this.apiUrl, body, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      }
    });
  }

  // -------------------------------------------------------
  // ENVIO DE IMAGEM
  // -------------------------------------------------------
  sendImage(file: File): Observable<any> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string);

        const body = {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "input_image",
                  image_url: base64
                }
              ]
            }
          ]
        };

        this.http.post<any>(this.apiUrl, body, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`
          }
        }).subscribe({
          next: res => observer.next(res),
          error: err => observer.error(err)
        });
      };

      reader.onerror = err => observer.error(err);

      // Lê arquivo inteiro como Base64
      reader.readAsDataURL(file);
    });
  }
}
