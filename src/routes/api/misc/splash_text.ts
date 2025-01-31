import { SPLASH_TEXT_ROUTE, type SplashTextData } from "~/api/misc"
import { duck } from "~/entry-server"
import { getSplashTextRandomly } from "~/features/data/misc"

duck.get(SPLASH_TEXT_ROUTE, async(context) => {
  const text = await getSplashTextRandomly()
  
  return context.json({
    text
  } as SplashTextData, 200)
})