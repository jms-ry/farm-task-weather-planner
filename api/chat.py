import os
import json
import urllib.request
import urllib.error
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
            api_key = os.environ.get('GEMINI_API_KEY')

            gemini_messages = []
            for msg in messages:
                role = 'model' if msg['role'] == 'assistant' else 'user'
                gemini_messages.append({
                    'role': role,
                    'parts': [{ 'text': msg['content'] }]
                })

            payload = {
                'system_instruction': {
                    'parts': [{ 'text': system_prompt }]
                },
                'contents': gemini_messages
            }

            url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key={api_key}'

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode(),
                headers={ 'Content-Type': 'application/json' },
                method='POST'
            )

            with urllib.request.urlopen(req) as res:
                result = json.loads(res.read().decode())
                reply = result['candidates'][0]['content']['parts'][0]['text']

            self.send_response(200)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({ 'reply': reply }).encode())

        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            self.send_response(500)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({ 'error': error_body }).encode())

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