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
