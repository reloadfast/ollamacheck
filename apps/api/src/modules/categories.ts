import { FastifyReply, FastifyRequest } from 'fastify';

// Get all categories
export async function getCategories(request: FastifyRequest, reply: FastifyReply) {
  try {
    // In a real implementation:
    // 1. Query database for all categories
    // 2. Return the list

    // For now, return mock data
    const categories = [
      {
        id: "1",
        slug: "code",
        label: "Code Agents",
        description: "Models optimized for code generation and tool use",
        icon: "💻"
      },
      {
        id: "2",
        slug: "vision",
        label: "Vision",
        description: "Models for image and vision tasks",
        icon: "👁️"
      },
      {
        id: "3",
        slug: "nlp",
        label: "NLP",
        description: "Natural language processing models",
        icon: "💬"
      },
      {
        id: "4",
        slug: "embeddings",
        label: "Embeddings",
        description: "Models for generating embeddings",
        icon: "🧬"
      }
    ];

    return { data: categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}