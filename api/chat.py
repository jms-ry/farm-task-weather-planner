import os
import json
import google.generativeai as genai
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

  def do_OPTIONS(self):
    self.send_response(200)
    self._send_cors_headers()
    self.end_headers()

  def do_POST(self):
    try:
      content_length = int(self.headers.get('Content-Length', 0))
      body = self.rfile.read(content_length)
      data = json.loads(body)

      messages = data.get('messages', [])
      system_prompt = data.get('systemPrompt', '')

      genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

      model = genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        system_instruction=system_prompt
      )

      # Gemini uses 'user' and 'model' roles (not 'assistant')
      gemini_messages = []
      for msg in messages:
        role = 'model' if msg['role'] == 'assistant' else 'user'
        gemini_messages.append({
          'role': role,
          'parts': [msg['content']]
        })

        chat = model.start_chat(history=gemini_messages[:-1])
        response = chat.send_message(gemini_messages[-1]['parts'][0])

        self.send_response(200)
        self._send_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({ 'reply': response.text }).encode())

    except Exception as e:
      self.send_response(500)
      self._send_cors_headers()
      self.send_header('Content-Type', 'application/json')
      self.end_headers()
      self.wfile.write(json.dumps({ 'error': str(e) }).encode())

  def _send_cors_headers(self):
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', 'Content-Type')