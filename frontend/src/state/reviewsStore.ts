import { defineStore } from "pinia"

import { deserializeReview, NewReview, Review } from "src/network/models/review"
import { createItem, getItems, updateItem } from "src/state/common"


export const useReviewsStore = defineStore("reviews", {
  state: () => {
    return {
      reviews: new Map<number, Review>(),
    }
  },
  actions: {
    async createReview(effort: NewReview): Promise<Readonly<Review>> {
      return createItem(this.reviews, effort, deserializeReview, "/api/reviews/")
    },
    async updateReview(effort: Review): Promise<Readonly<Review>> {
      return updateItem(this.reviews, effort, deserializeReview, `/api/reviews/${effort.id}/`)
    },
    async fetchReviews(): Promise<void> {
      getItems(this.reviews, deserializeReview, "/api/reviews/")
    },
  }
})
