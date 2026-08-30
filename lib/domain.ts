export type Review = { required: boolean; status: string; title?: string; catalogId?: string };

export function missingRequired(reviews: Review[]): Review[] {
  return reviews.filter((row) => row.required && row.status !== "accepted");
}

export function packetReady(reviews: Review[]): boolean {
  return missingRequired(reviews).length === 0;
}
