// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding

const cohortChatGPTIndex = pc.index(
  'cohort-chatgpt',
  process.env.PINECONE_INDEX_HOST
);

async function createMemory({ vectors, metadata, messageId }) {
  if (!vectors || !vectors.length) {
    throw new Error("Vector is empty — cannot upsert");
  }

  await cohortChatGPTIndex.upsert({
    records: [
      {
        id: messageId.toString(),
        values: Array.from(vectors),
        metadata: metadata || {}
      }
    ]
  });
}

async function queryMemory({ queryVector, limit = 20, metadata }) {
  const queryOptions = {
    vector: queryVector,
    topK: limit,
    includeMetadata: true
  };

  if (metadata && Object.keys(metadata).length > 0) {
    queryOptions.filter = metadata;
  }

  const data = await cohortChatGPTIndex.query(queryOptions);

  return data.matches;
}

module.exports = {createMemory,queryMemory}

