import { ref, onUnmounted } from 'vue'

export type WsStatus = 'connecting' | 'open' | 'closed' | 'error'

export function useWebSocket(url: string) {
  const messages = ref<string>("")
  const status = ref<WsStatus>('connecting')
  let ws: WebSocket | null = null

  function connect() {
    ws = new WebSocket(url)

    ws.onopen = () => {
      status.value = 'open'
    }

    ws.onmessage = (event: MessageEvent) => {
      messages.value = event.data
    }

    ws.onclose = () => {
      status.value = 'closed'
    }

    ws.onerror = () => {
      status.value = 'error'
    }
  }

  function send(msg: string) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(msg)
    }
  }

  function disconnect() {
    ws?.close()
  }

  connect()

  onUnmounted(disconnect)

  return { messages, status, send, disconnect }
}