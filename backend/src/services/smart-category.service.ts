import prisma from '../config/db';

const CATEGORY_RULES: Record<string, string[]> = {
  'Transport': ['uber', 'lyft', 'taxi', 'train', 'bus', 'flight', 'fuel', 'petrol'],
  'Food & Dining': ['mcdonalds', 'kfc', 'starbucks', 'restaurant', 'swiggy', 'zomato', 'pizza', 'grocery'],
  'Entertainment': ['netflix', 'spotify', 'movie', 'cinema', 'steam', 'game'],
  'Utilities': ['electricity', 'water', 'internet', 'broadband', 'phone', 'recharge'],
  'Shopping': ['amazon', 'flipkart', 'myntra', 'clothes', 'shoes', 'electronics'],
  'Healthcare': ['pharmacy', 'hospital', 'doctor', 'medicine', 'clinic']
};

export class SmartCategoryService {
  async detectCategory(description: string, userId: string): Promise<string | null> {
    const descLower = description.toLowerCase();
    let detectedCategoryName: string | null = null;

    for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
      if (keywords.some(keyword => descLower.includes(keyword))) {
        detectedCategoryName = category;
        break;
      }
    }

    if (!detectedCategoryName) {
      return null;
    }

    // Find or create the category for the user
    let category = await prisma.category.findFirst({
      where: { name: detectedCategoryName, userId }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: detectedCategoryName,
          userId,
          isDefault: true
        }
      });
    }

    return category.id;
  }
}

export const smartCategoryService = new SmartCategoryService();
