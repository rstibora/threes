import { DateTime, Duration, DurationObjectUnits, Interval } from "luxon"

import { getStringEnumKeyByValue } from "src/utils/enum"


export interface ReviewConfigurationSerialized {
    id: number
    name: string
}

export enum ConfigurationName {
    WEEKLY = "Weekly",
    FORTNIGHTLY = "Fortnightly",
    MONTHLY = "Monthly",
    QUARTERLY = "Quarterly",
    YEARLY = "Yearly"
}

export class ReviewConfiguration {
    id: number
    name: ConfigurationName

    constructor(id: number, name: ConfigurationName) {
        this.id = id
        this.name = name
    }

    serialize(): ReviewConfigurationSerialized {
        return { 
            id: this.id,
            name: this.name,
        }
    }

    static deserialize(serialized: ReviewConfigurationSerialized): ReviewConfiguration {
        return new ReviewConfiguration(serialized.id, ConfigurationName[getStringEnumKeyByValue(ConfigurationName, serialized.name)])
    }

    getReviewInterval(index: number): Interval {
        /**
         * Calculates interval (datetime from, to) for the review with this configuration and the given index.
         */
        const starts = DateTime.fromSeconds(0).plus(this.getDuration().mapUnits(durationUnit => durationUnit * index))
        const ends = starts.plus(this.getDuration())
        return Interval.fromDateTimes(starts, ends)
    }

    getReviewIndex(datetime: DateTime): number {
        /**
         * Calculates index of the review period for the given datetime.
         */
        let durationUnit = "weeks"
        let indexMultiplier = 1
        switch (this.name) {
            case ConfigurationName.WEEKLY: { break }
            case ConfigurationName.FORTNIGHTLY: { indexMultiplier = 2; break}
            case ConfigurationName.MONTHLY: { durationUnit = "months"; break }
            case ConfigurationName.QUARTERLY: { indexMultiplier = 3; break }
            case ConfigurationName.YEARLY: { durationUnit = "years"; break }
            default: { throw Error(`Unknown review configuration ${this.name}`)}
        }
        const index = Interval.fromDateTimes(DateTime.fromSeconds(0), datetime)
                        .length(durationUnit as keyof DurationObjectUnits)
        return Math.floor(index / indexMultiplier)
    }

    getReviewName(index: number): string {
        const inInterval = this.getReviewInterval(index).start
        let reviewName = ""
        switch (this.name) {
            case ConfigurationName.WEEKLY: { reviewName = `Week ${inInterval.weekNumber} ${inInterval.year}`; break }
            case ConfigurationName.FORTNIGHTLY: { reviewName = `Fortnight ${Math.floor(inInterval.weekNumber / 2)} ${inInterval.year}`; break }
            case ConfigurationName.MONTHLY: { reviewName = `${inInterval.monthLong} ${inInterval.year}`; break }
            case ConfigurationName.QUARTERLY: { reviewName = `Q${inInterval.quarter} ${inInterval.year}`; break }
            case ConfigurationName.YEARLY: { reviewName = `Year ${inInterval.year}`; break }
            default: { throw Error(`Unknown review configuration ${this.name}`)}
        }
        return reviewName
    }

    private getDuration(): Duration {
        if (this.name === ConfigurationName.WEEKLY) {
            return Duration.fromObject({ weeks: 1 })
        }
        if (this.name === ConfigurationName.FORTNIGHTLY) {
            return Duration.fromObject({ weeks: 2 })
        }
        if (this.name === ConfigurationName.MONTHLY) {
            return Duration.fromObject({ months: 1 })
        }
        if (this.name === ConfigurationName.QUARTERLY) {
            return Duration.fromObject({ months: 3 })
        }
        if (this.name === ConfigurationName.YEARLY) {
            return Duration.fromObject({ years: 1 })
        }
        throw Error(`Unknown configuration name '${this.name}'.`)
    }
}
