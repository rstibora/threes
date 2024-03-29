import { DateTime, Duration, DurationObjectUnits } from "luxon"


export function relativeDateTime(datetime: DateTime): string {
  /** Produces string with human readable duration from the provided date. */
  const units: (keyof DurationObjectUnits)[] = [
    "years", "months", "weeks", "days", "hours", "minutes", "seconds"]
  const diff = datetime.diffNow().shiftTo(...units)
  const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: "auto" });
  const unit = units.find((unit) => diff.get(unit) !== 0) || units[units.length - 1]
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit as Intl.RelativeTimeFormatUnit)
}

export function displayIntervalEnd(datetime: DateTime): DateTime {
  return datetime.minus(Duration.fromObject({ seconds: 1 }))
}

export function displaySeconds(seconds: number): string {
  /** Converts seconds to a more user-facing string (e.g. 32.5 m, 1.3 h). */
  if (seconds < 60) {
    return `${seconds.toFixed(0)} s`
  } else if (seconds < 3600) {
    return `${(seconds / 60).toFixed(0)} m`
  }
  return `${(seconds / 3600).toFixed(1)} h`
}
