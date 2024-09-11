import { createApp, h } from 'vue'
import MessageComponent from './MessageComponent.vue'

const Message = {
  instances: [] as { app: any, container: HTMLElement, instance: any }[],

  show(options: { message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number }) {
    const { message, type = 'info', duration = 500 } = options

    const currentLen = this.instances.length
    if (currentLen) {
      this.instances.forEach((item, index) => {
        const translateY = (currentLen - index) * 60
        const dom = item.container.childNodes[0] as HTMLElement
        dom.style.transform = `translateY(${translateY}px)`
      })
    }

    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
      render() {
        return h(MessageComponent, { message, type })
      },
    })

    const instance = app.mount(container)
    this.instances.push({ app, container, instance })

    setTimeout(() => {
      this.close(instance)
    }, duration)

    return instance
  },

  close(instance: any) {
    const index = this.instances.findIndex(item => item.instance === instance)
    if (index > -1) {
      const { app, container } = this.instances[index]
      app.unmount()
      document.body.removeChild(container)
      this.instances.splice(index, 1)
    }
  },

  closeAll() {
    this.instances.forEach(({ app, container }) => {
      app.unmount()
      document.body.removeChild(container)
    })
    this.instances = []
  },
}

export default Message
