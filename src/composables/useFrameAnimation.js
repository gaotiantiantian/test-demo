import { computed, onBeforeUnmount, ref, watch } from 'vue'

const frameModules = import.meta.glob('@/assets/images/loading/img_[0-9]*.png', {
  eager: true,
  import: 'default',
})

const frames = Object.entries(frameModules)
  .sort(([left], [right]) => {
    const number = (path) => Number(path.match(/img_(\d+)\.png$/)?.[1] ?? 0)
    return number(left) - number(right)
  })
  .map(([, source]) => source)

export function useFrameAnimation(active, interval = 50) {
  const frameIndex = ref(0)
  let timer = null

  const currentFrame = computed(() => frames[frameIndex.value] ?? '')

  function stop() {
    if (timer) window.clearInterval(timer)
    timer = null
    frameIndex.value = 0
  }

  watch(
    active,
    (isActive) => {
      stop()
      if (!isActive || frames.length === 0) return
      timer = window.setInterval(() => {
        frameIndex.value = (frameIndex.value + 1) % frames.length
      }, interval)
    },
    { immediate: true },
  )

  onBeforeUnmount(stop)

  return { currentFrame }
}
