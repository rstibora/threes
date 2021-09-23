import { DateTime, DurationObjectUnits } from "luxon"


export function relativeDateTime(datetime: DateTime): string {
    const units: (keyof DurationObjectUnits)[] = ["year", "month", "week", "day", "hour", "minute", "second"]
    const diff = datetime.diffNow().shiftTo(...units)
    const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: "auto" });
    const unit = units.find((unit) => diff.get(unit) !== 0) || units[units.length - 1]
    return relativeFormatter.format(Math.trunc(diff.as(unit)), unit as Intl.RelativeTimeFormatUnit)
}
