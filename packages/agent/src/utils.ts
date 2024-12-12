export function parseDuration(duration: string | number): number {
  if (typeof duration == 'number') {
    return duration;
  } else if (duration.match(/^\d+$/)) {
    return parseInt(duration);
  }

  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration: ${duration}`);
  }

  const value = Number(match[1]);
  switch (match[2]) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
  }

  throw new Error(`Invalid duration: ${duration}`);
}
