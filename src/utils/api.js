export async function sendMessage(systemPrompt, messages) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, messages })
  })

  const text = await response.text()
  console.log('API raw response:', text)

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    throw new Error('Invalid response from server: ' + text)
  }

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data.reply
}