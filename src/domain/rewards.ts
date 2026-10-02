import { REWARD_RULES } from '@/config/app'
import { levelFromXp, starsFromAccuracy, todayKey, nextDayKey } from '@/lib/xp'
import type {
  AchievementDefinition,
  ChildProfile,
  LessonSessionResult,
  RewardPayload,
} from '@/types'

export function computeLessonRewards(
  profile: ChildProfile,
  result: LessonSessionResult,
  newlyUnlocked: AchievementDefinition[],
): { profile: ChildProfile; reward: RewardPayload } {
  const perfect = result.accuracy >= 0.95
  let xp =
    REWARD_RULES.lessonCompleteXp +
    Math.round(result.accuracy * result.results.length * REWARD_RULES.correctAnswerXp)
  let coins =
    REWARD_RULES.lessonCompleteCoins +
    Math.floor(result.accuracy * result.results.length) * REWARD_RULES.correctAnswerCoins

  if (perfect) {
    xp += REWARD_RULES.perfectLessonBonusXp
    coins += REWARD_RULES.perfectLessonBonusCoins
  }

  if (result.stars >= 3) {
    xp += 15
  }

  const today = todayKey()
  let streakDays = profile.streakDays
  if (profile.lastPlayedDate === today) {
    // same day
  } else if (profile.lastPlayedDate && nextDayKey(profile.lastPlayedDate) === today) {
    streakDays += 1
    coins += REWARD_RULES.streakBonusCoins
  } else {
    streakDays = 1
  }

  const previousLevel = profile.level
  const nextXp = profile.xp + xp
  const nextLevel = levelFromXp(nextXp)
  const achievementIds = new Set(profile.achievements)
  for (const achievement of newlyUnlocked) {
    achievementIds.add(achievement.id)
  }

  const updated: ChildProfile = {
    ...profile,
    xp: nextXp,
    points: profile.points + xp,
    coins: profile.coins + coins,
    level: nextLevel,
    streakDays,
    lastPlayedDate: today,
    achievements: [...achievementIds],
    updatedAt: new Date().toISOString(),
  }

  return {
    profile: updated,
    reward: {
      xp,
      coins,
      points: xp,
      achievements: newlyUnlocked,
      leveledUp: nextLevel > previousLevel,
      newLevel: nextLevel,
    },
  }
}

export { starsFromAccuracy }
