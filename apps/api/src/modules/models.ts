import { FastifyReply, FastifyRequest } from 'fastify';

// Mock data for now - in a real implementation, this would fetch from the database
const mockModels = [
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
  }
];

// Get paginated models with filters
export async function getModels(request: FastifyRequest, reply: FastifyReply) {
  try {
    const {
      limit = 20,
      page = 1
    } = request.query as any;

    // In a real implementation, we would:
    // 1. Query the database with filters
    // 2. Apply sorting
    // 3. Paginate results

    // For now, return mock data
    const models = mockModels;

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit as string);
    const total = models.length;

    const paginatedModels = models.slice(startIndex, endIndex);

    return {
      data: paginatedModels,
      meta: {
        total,
        page,
        limit,
        lastUpdatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching models:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

// Get model by slug
export async function getModelBySlug(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { slug } = request.params as any;

    // In a real implementation:
    // 1. Query database for the specific model
    // 2. Return the model or 404 if not found

    const model = mockModels.find(m => m.slug === slug);

    return { data: model };
  } catch (error) {
    console.error('Error fetching model:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}