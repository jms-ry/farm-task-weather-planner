export async function sendMessage(systemPrompt, messages) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, messages })
  })

  const text = await response.text()
  console.log('API raw response:', text)

  // extract the last valid JSON object from the response
  // this handles cases where the response contains multiple JSON objects
  const jsonMatches = text.match(/\{.*?\}/gs)
  if (!jsonMatches || jsonMatches.length === 0) {
    throw new Error('No valid JSON in response: ' + text)
  }

  let data
  try {
    data = JSON.parse(jsonMatches[jsonMatches.length - 1])
  } catch (e) {
    throw new Error('Failed to parse JSON: ' + text)
  }

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data.reply
}