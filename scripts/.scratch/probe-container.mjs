import { GraphClient } from '@optimizely/cms-sdk';

const client = new GraphClient(process.env.OPTIMIZELY_GRAPH_SINGLE_KEY, {
  graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
});

const NIQ_FOLDER = 'ee7eb0d92d8645939d0a71079b9fad80';

const QUERY = `
  query Probe($p: String!) {
    SysContentFolder(where: { _metadata: { container: { eq: $p } } }) {
      items { _metadata { key displayName } }
    }
    HeroBlock(where: { _metadata: { container: { eq: $p } } }) {
      items { _metadata { key displayName } }
    }
    ProofBlock(where: { _metadata: { container: { eq: $p } } }) {
      items { _metadata { key displayName } }
    }
    ActionBlock(where: { _metadata: { container: { eq: $p } } }) {
      items { _metadata { key displayName } }
    }
  }
`;

try {
  const data = await client.request(QUERY, { p: NIQ_FOLDER });
  console.log(JSON.stringify(data, null, 2));
} catch (e) {
  console.log('ERROR', e.message);
}
