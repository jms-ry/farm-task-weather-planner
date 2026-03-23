export async function sendMessage(systemPrompt, messages) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, messages })
  })

  const text = await response.text()
  // console.log('API raw response:', text)

  // try parsing the whole text first
  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    // if that fails, find the FIRST valid { ... } block only
    const firstBrace = text.indexOf('{')
    const firstClose = text.indexOf('"}')
    if (firstBrace === -1 || firstClose === -1) {
      throw new Error('No valid JSON found in response')
    }
    const jsonStr = text.substring(firstBrace, firstClose + 2)
    try {
      data = JSON.parse(jsonStr)
    } catch (e2) {
      throw new Error('Failed to parse response')
    }
  }

  if (data.error) {
    throw new Error(data.error)
  }

  return data.reply
}