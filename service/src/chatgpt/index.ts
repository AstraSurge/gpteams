import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI } from 'chatgpt'
import { SocksProxyAgent } from 'socks-proxy-agent'
import httpsProxyAgent from 'https-proxy-agent'
import fetch from 'node-fetch'
import { sendResponse } from '../utils'
import type { ChatContext, ModelConfig } from '../types'
import { adminConfigRef } from '~/firebaseAdmin'

const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

const { HttpsProxyAgent } = httpsProxyAgent

dotenv.config()

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000

const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL
const model = (typeof OPENAI_API_MODEL === 'string' && OPENAI_API_MODEL.length > 0)
  ? OPENAI_API_MODEL
  : 'gpt-3.5-turbo'

const chatGptApiOptions: ChatGPTAPIOptions = {
  apiKey: '',
  completionParams: { model },
  debug: false,
}

if (process.env.OPENAI_API_BASE_URL && process.env.OPENAI_API_BASE_URL.trim().length > 0)
  chatGptApiOptions.apiBaseUrl = process.env.OPENAI_API_BASE_URL

if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
  const agent = new SocksProxyAgent({
    hostname: process.env.SOCKS_PROXY_HOST,
    port: process.env.SOCKS_PROXY_PORT,
  })
  chatGptApiOptions.fetch = (url, options) => {
    return fetch(url, { agent, ...options })
  }
}

const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.ALL_PROXY || process.env.all_proxy
if (httpsProxy) {
  const agent = new HttpsProxyAgent(httpsProxy)
  chatGptApiOptions.fetch = (url, options) => {
    return fetch(url, { agent, ...options })
  }
}

let chatGptApi = null

// set initial api key
adminConfigRef.get().then((doc) => {
  if (doc.exists) {
    const data = doc.data()
    if (data?.openaiApiKeys?.length > 0) {
      chatGptApiOptions.apiKey = data.openaiApiKeys[0]
      chatGptApi = new ChatGPTAPI(chatGptApiOptions)
    }
  }
})

export async function updateOpenaiApiKey(apiKey: string) {
  chatGptApiOptions.apiKey = apiKey
  chatGptApi = new ChatGPTAPI(chatGptApiOptions)
}

export async function updateChatgptModel(model: string) {
  chatGptApiOptions.completionParams.model = model
  chatGptApi = new ChatGPTAPI(chatGptApiOptions)
}

async function chatReplyProcess(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
  process?: (chat: ChatMessage) => void,
) {
  // if (!message)
  //   return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    let options: SendMessageOptions = { timeoutMs }

    if (lastContext)
      options = { parentMessageId: lastContext.parentMessageId }

    const response = await chatGptApi.sendMessage(message, {
      ...options,
      onProgress: (partialResponse) => {
        process?.(partialResponse)
      },
    })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

async function chatConfig() {
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.ALL_PROXY || process.env.all_proxy

  return sendResponse({
    type: 'Success',
    data: {
      apiModel: 'ChatGPTAPI',
      reverseProxy: process.env.API_REVERSE_PROXY,
      timeoutMs,
      socksProxy: (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) ? (`${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`) : '-',
      httpsProxy,
    } as ModelConfig,
  })
}

export type { ChatContext, ChatMessage }

export { chatReplyProcess, chatConfig }
