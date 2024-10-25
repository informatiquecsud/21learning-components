from asyncio import sleep as sleep_s

async def sleep_ms(ms):
  await sleep_s(ms / 1000)

async def delay(ms):
    await sleep_s(ms / 1000)

