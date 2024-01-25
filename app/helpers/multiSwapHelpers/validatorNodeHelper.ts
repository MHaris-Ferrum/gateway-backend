export const handleValidatorRequest = async (
  data: any,
  swapTxHash: string,
  query: any
) => {
  try {
    let filter: any = {
      receiveTransactionId: swapTxHash,
      status:
        utils.swapAndWithdrawTransactionStatuses.generatorSignatureCreated,
      "validatorSig.address": {
        $ne: query?.address,
      },
    };

    let transaction = await db.SwapAndWithdrawTransactions.findOne(filter);
    if (data && transaction) {
      filter._id = transaction._id;
      let transactionReceipt = data?.transactionReceipt;
      if (
        transactionReceipt?.status &&
        transactionReceipt?.status == true &&
        data?.signedData
      ) {
        transaction = getValidatorSignedData(transaction, data?.signedData);
        if (
          transaction?.validatorSig?.length ==
          commonFunctions.getNumberOfAllowedValidators()
        ) {
          transaction.status =
            utils.swapAndWithdrawTransactionStatuses.validatorSignatureCreated;
        }
      } else {
        transaction.status =
          utils.swapAndWithdrawTransactionStatuses.swapFailed;
      }

      transaction.updatedAt = new Date();

      transaction = await db.SwapAndWithdrawTransactions.findOneAndUpdate(
        filter,
        transaction,
        { new: true }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

function getValidatorSignedData(transaction: any, signedData: any) {
  try {
    let validator: any = {};
    validator.salt = signedData.salt;
    validator.address = signedData.address.toLowerCase();
    validator.signatures = signedData.signatures;
    validator.updatedAt = new Date();
    transaction.validatorSig.push(validator);
  } catch (e) {
    console.log(e);
  }
  return transaction;
}