import { prisma } from "../index.js";


export const getCelebsByCategory = async (category, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    
    // Business logic for different categories can be updated here
    const categoryQueries = {
      'best-sellers': {
        where: { completed_onboarding: true },
        orderBy: { request_num: 'desc' }
      },
      'trending-now': {
        where: { completed_onboarding: true, followers: { gte: 5000 } },
        orderBy: { followers: 'desc' }
      },
      // ... other categories ...
    };
  
    const query = categoryQueries[category.toLowerCase()] || {
      where: { category: { equals: category, mode: 'insensitive' } }
    };
  
    return prisma.celeb.findMany({
      skip: offset,
      take: pageSize,
      ...query
    });
  };
  

// index the new celeb for search functionality. 
  export async function indexNewCeleb(uid) {
    const result = await prisma.$executeRaw`
      UPDATE "Celeb"
      SET document_with_idx = TO_TSVECTOR('simple', displayname)
      WHERE uid = ${uid};
    `;
  }