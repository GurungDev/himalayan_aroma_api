import { model, Schema } from "mongoose";

const tableSchema = new Schema(
  {
    table_number: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 1,
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [ "ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    }
  },
  {
    timestamps: true,
  }
);

const Table = model("Table", tableSchema);
export default Table;
