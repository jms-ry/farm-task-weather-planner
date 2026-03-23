export async function sendMessage(systemPrompt, messages) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, messages })
  })

  const data = await response.json()
  console.log('API response:', data)

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data.reply
}