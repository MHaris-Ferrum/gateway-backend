"use strict";
var mongoose = require("mongoose");

var schema = mongoose.Schema(
  {
    createdByUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    updatedByUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
    isActive: { type: Boolean, default: false },
    destinationNetwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "networks",
    },
    sourceNetwork: { type: mongoose.Schema.Types.ObjectId, ref: "networks" },
    destinationCabn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "currencyAddressesByNetwork",
    },
    sourceCabn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "currencyAddressesByNetwork",
    },
    destinationCurrency: { type: String, default: "" },
    receiveTransactionId: { type: String, default: "" },
    destinationTransactionTimestamp: { type: Number, default: null },
    destinationWalletAddress: { type: String, default: "" },
    destinationAmount: { type: String, default: "" },
    sourceWalletAddress: { type: String, default: "" },
    sourceTimestamp: { type: Number, default: null },
    sourceCurrency: { type: String, default: "" },
    sourceAmount: { type: String, default: "" },
    generatorSig: {
      signatures: [
        {
          hash: { type: String, default: "" },
          signature: { type: String, default: "" },
        },
      ],
      salt: { type: String, default: "" },
    },
    validatorSig: [
      {
        signatures: [
          {
            hash: { type: String, default: "" },
            signature: { type: String, default: "" },
          },
        ],
        salt: { type: String, default: "" },
        address: { type: String, default: "" },
      },
    ],
    payBySig: {
      hash: { type: String, default: "" },
      signatures: [],
      salt: { type: String, default: "" },
    },
    status: { type: String, default: "swapPending" },
    withdrawTransactions: [
      {
        transactionId: { type: String },
        status: { type: String },
      },
    ],
    creator: { type: String, default: "" },
    sourceSmartContractAddress: { type: String, default: "" },
    destinationSmartContractAddress: { type: String, default: "" },
    nodeJobs: [
      {
        id: { type: String, default: "" },
        status: { type: String, default: "pending" }, //can be '', 'pending', 'created', 'failed', 'completed'
        type: { type: String, default: "" }, //can be '', 'generator', 'validator', 'master'
        createdAt: { type: Date, default: new Date() },
        updatedAt: { type: Date, default: new Date() },
      },
    ],
    sourceAssetType: { type: String, default: "" },
    destinationAssetType: { type: String, default: "" },
    version: { type: String, default: "" },
    sourceBridgeAmount: { type: String, default: "" },
    destinationBridgeAmountIn: { type: String, default: "" },
    destinationBridgeAmountOut: { type: String, default: "" },
    sourceOneInhceData: { type: String, default: "" },
    destinationOneInhceData: { type: String, default: "" },
    responseCode: { type: Number, default: "" },
    responseMessage: {},
  },
  { collection: "swapAndWithdrawTransactions" }
);

var currenciesModel = mongoose.model("swapAndWithdrawTransactions", schema);
module.exports = currenciesModel;
