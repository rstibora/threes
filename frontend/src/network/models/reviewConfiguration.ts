import { DateTime, Duration, DurationObjectUnits, Interval } from "luxon"

import { getStringEnumKeyByValue } from "src/utils/enum"


export interface ReviewConfigurationSerialized {
    id: number
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

    getName(index: number): string {
        return "YOLO"
    }

    // constructName(reviewPeriod: ReviewPeriod | NewReviewPeriod): string {
    //     let prefix = ""
    //     switch (this.indexType) {
    //         case IndexType.WEEK_NUMBER: { prefix = "Week"; break }
    //         case IndexType.FORTNIGHT_NUMBER: { prefix = "Fortnight"; break }
    //         case IndexType.YEAR_NUMBER: { prefix = "Year"; break }
    //         case IndexType.INTEGER : 
    //         case IndexType.MONTH_NAME:
    //         case IndexType.QUARTER_NUMBER: { break }
    //         default: { throw Error(`Unknown index type ${this.indexType}`)}
    //     }

    //     // Humans are used to indexing starting from one.
    //     let stringIndex = (reviewPeriod.index + 1).toString()

    //     if (this.indexType == IndexType.MONTH_NAME) {
    //         stringIndex = new Date(1991, reviewPeriod.index).toLocaleString("default", { month: "long"})
    //     } else if (this.indexType == IndexType.QUARTER_NUMBER) {
    //         stringIndex = ["Q1", "Q2", "Q3", "Q4"][reviewPeriod.index]
    //     } else if (this.indexType == IndexType.YEAR_NUMBER) {
    //         stringIndex = (this.starts.year + reviewPeriod.index).toString()
    //     }
    //     const suffix = this.indexReset == IndexReset.END_OF_YEAR ? this.starts.year + reviewPeriod.reviewPeriodIndex : ""

    //     return [prefix, stringIndex, suffix].join(" ")
    // }

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
