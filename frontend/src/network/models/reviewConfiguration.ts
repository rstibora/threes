import { DateTime, Duration, DurationObjectUnits, Interval } from "luxon"

import { getStringEnumKeyByValue } from "src/utils/enum"


export interface ReviewConfigurationSerialized {
    id?: number
    name: string
}

export enum ConfigurationName {
    WEEKLY = "Weekly",
    FORTNIGHTLY = "Fortnightly",
    MONTLY = "Monthly",
    QUARTERLY = "Quarterly",
    YEARLY = "Yearly"
}

export class ReviewConfiguration {
    name: ConfigurationName

    constructor(name: ConfigurationName) {
        this.name = name
    }

    serialize(): ReviewConfigurationSerialized {
        return { 
            name: this.name
        }
    }

    static deserialize(serialized: ReviewConfigurationSerialized): ReviewConfiguration {
        return new ReviewConfiguration(ConfigurationName[getStringEnumKeyByValue(ConfigurationName, serialized.name)])
    }

    getInterval(index: number): Interval {
        /**
         * Calculates interval (datetime from, to) for the review with this configuration and the given index.
         */
        const starts = DateTime.fromSeconds(0).plus(this.getDuration().mapUnits(durationUnit => durationUnit * index))
        const ends = starts.plus(this.getDuration())
        return Interval.fromDateTimes(starts, ends)
    }

    getIndex(datetime: DateTime): number {
        /**
         * Calculates index of the review period for the given datetime.
         */
        let durationUnit = "weeks"
        let indexMultiplier = 1
        if (this.name === ConfigurationName.FORTNIGHTLY) {
            indexMultiplier = 2
        }
        if (this.name === ConfigurationName.MONTLY) {
            durationUnit = "months"
        }
        if (this.name === ConfigurationName.QUARTERLY) {
            indexMultiplier = 3
        }
        if (this.name === ConfigurationName.YEARLY) {
            durationUnit = "years"
        }
        const index = Interval.fromDateTimes(DateTime.fromSeconds(0), datetime).length(durationUnit as keyof DurationObjectUnits)
        return Math.floor(index / indexMultiplier)
    }

    private getDuration(): Duration {
        if (this.name === ConfigurationName.WEEKLY) {
            return Duration.fromObject({ weeks: 1 })
        }
        if (this.name === ConfigurationName.FORTNIGHTLY) {
            return Duration.fromObject({ weeks: 2 })
        }
        if (this.name === ConfigurationName.MONTLY) {
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
