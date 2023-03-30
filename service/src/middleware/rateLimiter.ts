import { RateLimiterMemory } from 'rate-limiter-flexible'
import groupModel from '~/model/groups'

export class GroupLimits {
  private static instance: Map<string, RateLimiterMemory>

  private constructor() { }

  public static async getInstance() {
    if (GroupLimits.instance)
      return GroupLimits.instance

    await GroupLimits.updateInstance()

    // subscribe to group changes
    groupModel.subscribeToGroups(() => {
      GroupLimits.updateInstance()
    })

    return GroupLimits.instance
  }

  private static async updateInstance() {
    const allGroups = await groupModel.getAllGroups()
    const newMap = this.instance || new Map<string, RateLimiterMemory>()
    allGroups.forEach((group) => {
      // if no data, then set
      if (!newMap.get(group.id)) {
        newMap.set(group.id, new RateLimiterMemory({
          keyPrefix: group.id,
          points: group.operationPoints,
          duration: 60 * 60, // 1 hour
        }))
      }
      else {
        // if data exists, then update
        const rateLimiter = newMap.get(group.id)
        rateLimiter.points = group.operationPoints
      }
    })

    GroupLimits.instance = newMap
  }
}

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    // admin bypass
    if (res.locals.isAdmin) {
      next()
      return
    }
    // TODO: update get userGroup logic in 1.1.0
    const userGroup = await groupModel.getDefaultGroup()
    // if no limit, then bypass
    if (!userGroup.operationPoints) {
      next()
      return
    }

    const groupLimits = await GroupLimits.getInstance()
    const groupLimit = groupLimits.get(userGroup.id)

    if (!groupLimit)
      throw new Error('System Error')
    await groupLimit.consume(res.locals.uid)
    next()
  }
  catch (rejRes) {
    res.status(429).send('Too Many Requests')
  }
}

export default rateLimiterMiddleware
