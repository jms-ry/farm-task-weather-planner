import os
import json
import urllib.request
import urllib.error

def handler(request):
    if request.method == 'OPTIONS':
        return Response('', headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        })

    try:
        body = request.body
        data = json.loads(body)

        messages = data.get('messages', [])
        system_prompt = data.get('systemPrompt', '')
        api_key = os.environ.get('GEMINI_API_KEY')

        gemini_messages = []
        for msg in messages:
            role = 'model' if msg['role'] == 'assistant' else 'user'
            gemini_messages.append({
                'role': role,
                'parts': [{'text': msg['content']}]
            })

        payload = {
            'system_instruction': {
                'parts': [{'text': system_prompt}]
            },
            'contents': gemini_messages
        }

        url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={api_key}'

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode(),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        with urllib.request.urlopen(req) as res:
            result = json.loads(res.read().decode())
            reply = result['candidates'][0]['content']['parts'][0]['text']

        return Response(
            json.dumps({'reply': reply}),
            headers={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        )

    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return Response(
            json.dumps({'error': error_body}),
            status=500,
            headers={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        )

    except Exception as e:
        return Response(
            json.dumps({'error': str(e)}),
            status=500,
            headers={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        )