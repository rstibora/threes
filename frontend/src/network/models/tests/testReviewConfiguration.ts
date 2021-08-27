import { params, suite } from '@testdeck/jest'

import { DateTime, Interval } from 'luxon';

import { ConfigurationName, ReviewConfiguration } from "src/network/models/reviewConfiguration"

@suite class ReviewPeriodConfigurationTests {
    // The week with index 0 is the first complete week of the epoch.
    @params({ configurationName: ConfigurationName.WEEKLY, index: 0,
              expectedInterval: Interval.fromDateTimes(DateTime.fromObject({ year: 1970, month: 1, day: 5}),
                                                       DateTime.fromObject({ year: 1970, month: 1, day: 11}))})
    @params({ configurationName: ConfigurationName.MONTHLY, index: 1,
              expectedInterval: Interval.fromDateTimes(DateTime.fromObject({ year: 1970, month: 2, day: 1}),
                                                       DateTime.fromObject({ year: 1970, month: 2, day: 28}))})
    testgetReviewInterval({ configurationName, index, expectedInterval }) {
        const configuration = new ReviewConfiguration(0, configurationName)
        const interval = configuration.getReviewInterval(index)
        expect(interval.equals(expectedInterval)).toBe(true)
    }

    @params({ configurationName: ConfigurationName.WEEKLY, datetime: DateTime.fromObject({ year: 1970, month: 1, day: 6}), expectedIndex: 0})
    @params({ configurationName: ConfigurationName.WEEKLY, datetime: DateTime.fromObject({ year: 2020, month: 11, day: 20 }), expectedIndex: 2654})
    testgetReviewIndex({ configurationName, datetime, expectedIndex }) {
        const configuration = new ReviewConfiguration(0, configurationName)
        const index = configuration.getReviewIndex(datetime)
        expect(index).toEqual(expectedIndex)
    }

    @params({ configurationName: ConfigurationName.WEEKLY, datetime: DateTime.fromObject({ year: 2020, month: 3, day: 5 }) })
    @params({ configurationName: ConfigurationName.WEEKLY, datetime: DateTime.fromObject({ year: 2020, month: 3, day: 5 }) })
    testgetReviewIntervalgetReviewIndex({ configurationName, datetime }) {
        const configuration = new ReviewConfiguration(0, configurationName)
        const index = configuration.getReviewIndex(datetime)
        const interval = configuration.getReviewInterval(index)
        expect(interval.contains(datetime)).toBe(true)
    }
}
