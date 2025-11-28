import { PRODUCTS, SYMPTOM_TO_PRODUCT_ID, normalizeTag, type Product,  } from "./products";


interface ScoredProduct extends Product {
  matchScore: number;
}

export function getRecommendations(
  userSymptoms: string[], 
  categoryFilter: string = "All"
) {
  const productScores: Record<string, number> = {};
  userSymptoms.forEach((symptom) => {
    const key = normalizeTag(symptom);
    const matchingProductIds = SYMPTOM_TO_PRODUCT_ID[key] || [];
    
    matchingProductIds.forEach((id) => {
      productScores[id] = (productScores[id] || 0) + 1;
    });
  });

  const processedProducts: ScoredProduct[] = PRODUCTS
    .filter((p) => categoryFilter === "All" || p.category === categoryFilter)
    .map((p) => ({
      ...p,
      matchScore: productScores[p.id] || 0,
    }));

  const recommended = processedProducts
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore); 
  const others = processedProducts.filter((p) => p.matchScore === 0);

  return { recommended, others };
}