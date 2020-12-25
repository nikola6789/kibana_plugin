
export default function (server) {

  const { callWithRequest } = server.plugins.elasticsearch.getCluster('data');


  server.route({
    path: '/api/quality_dashboard/elsData',
    method: 'GET',
   handler: async function (req, res) {
      let resp = {}
      try {
        resp = await callWithRequest(req, 'search', {
          index: 'test-index',
          size: 10,
          body: {
            query: {
              match: {
                message: "Test"
              }
            }
          }
        })
      } catch (errResp) {
        resp = errResp
      }
      return { body: resp }
    }
  });
}
