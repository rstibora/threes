import { defineStore } from "pinia"

import { deserializeReviewConfiguration, ReviewConfiguration } from "src/network/models/reviewConfiguration"
import { deserializeUserReviewConfiguration, UserReviewConfiguration } from "src/network/models/userReviewConfiguration"
import { getItems } from "src/state/common"


export const useReviewConfigurationsStore = defineStore("reviewConfigurations", {
  state: () => {
    return {
      configurations: new Map<number, ReviewConfiguration>(),
      userConfigurations: new Map<number, UserReviewConfiguration>(),
    }
  },
  actions: {
    async fetchReviewConfigurations(): Promise<void> {
      getItems(this.configurations, deserializeReviewConfiguration, "/api/review_configurations/")
    },
    async fetchUserReviewConfigurations(): Promise<void> {
      getItems(this.userConfigurations, deserializeUserReviewConfiguration, "/api/user_review_configurations/")
    }
  }
})
