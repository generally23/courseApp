const { Schema, model } = require('mongoose');

const purchaseSchema = new Schema(
  {
    purchasedItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    purchaserId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'A purchase must have a purchaser'],
    },
  },
  { timestamps: true }
);

const Purchase = model('Purchase', purchaseSchema);

module.exports = Purchase;
