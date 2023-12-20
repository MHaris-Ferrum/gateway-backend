module.exports = function (router: any) {
  router.get("/:chainId", async (req: any, res: any) => {
    var filter: any = {};

    if (req.params.chainId) {
      filter.chainId = req.params.chainId;
    }

    if (req.params.type) {
      filter.type = req.params.type;
    }

    let gasFees = await db.GasFees.findOne(filter);

    return res.http200({
      gasFees: gasFees,
    });
  });
};
