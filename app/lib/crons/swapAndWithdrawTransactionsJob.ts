export {};
const LIMIT = 100;
// const DELAY = 120000;
const DELAY = 15000;

module.exports = function () {
  if (
    (global as any).starterEnvironment
      .isCronEnvironmentSupportedForSwapAndWithdrawTransactionsJob === "no"
  ) {
    start();
  }
};

async function start() {
  try {
    console.log("swapAndWithdrawTransactionsJob cron triggered:::");
    console.log(new Date());
    triggerJobs(0);
  } catch (e) {
    console.log(e);
  }
}

async function triggerJobs(offset: any) {
  let filter: any = {};
  filter.$or = [
    { status: { $eq: utils.swapAndWithdrawTransactionStatuses.swapPending } },
    {
      status: {
        $eq: utils.swapAndWithdrawTransactionStatuses.generatorSignatureCreated,
      },
    },
    {
      status: {
        $eq: utils.swapAndWithdrawTransactionStatuses.validatorSignatureCreated,
      },
    },
    { status: { $eq: utils.swapAndWithdrawTransactionStatuses.swapCompleted } },
  ];
  filter.version = "v3";
  let transactions = await db.SwapAndWithdrawTransactions.find(filter)
    .populate("sourceCabn")
    .populate("destinationCabn")
    .populate({
      path: "destinationNetwork",
      populate: {
        path: "multiswapNetworkFIBERInformation",
        model: "multiswapNetworkFIBERInformations",
      },
    })
    .populate({
      path: "sourceNetwork",
      populate: {
        path: "multiswapNetworkFIBERInformation",
        model: "multiswapNetworkFIBERInformations",
      },
    })
    .skip(offset)
    .limit(LIMIT);
  console.log("transactions", transactions.length);
  if (transactions && transactions.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      let req: any = {};
      req.query = {};
      let user: any = {};
      let transaction = transactions[i];
      req.swapTxId = transaction.receiveTransactionId;
      req.sourceNetwork = transaction.sourceNetwork;
      req.destinationNetwork = transaction.destinationNetwork;
      req.query.sourceBridgeAmount = transaction.sourceBridgeAmount
        ? transaction.sourceBridgeAmount
        : 0;
      req.query.destinationBridgeAmountIn =
        transaction.destinationBridgeAmountIn
          ? transaction.destinationBridgeAmountIn
          : 0;
      user._id = transaction.createdByUser;
      req.user = user;
      await swapTransactionHelper.doSwapAndWithdraw(req, transaction);
    }
  }
  if (transactions && transactions.length < LIMIT) {
    await delay(DELAY);
    triggerJobs(0);
  } else {
    offset += LIMIT;
    triggerJobs(offset);
  }
}

function delay(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
