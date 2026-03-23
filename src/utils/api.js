export async function sendMessage(systemPrompt, messages) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, messages })
  })

  const text = await response.text()
  console.log('API raw response:', text)

  // find the last { ... } block in the response
  const lastBrace = text.lastIndexOf('}')
  const firstBrace = text.lastIndexOf('{', lastBrace)

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('No valid JSON found in response')
  }

  const jsonStr = text.substring(firstBrace, lastBrace + 1)

  let data
  try {
    data = JSON.parse(jsonStr)
  } catch (e) {
    throw new Error('Failed to parse JSON: ' + jsonStr)
  }

  if (data.error) {
    throw new Error(data.error)
  }

  return data.reply
}