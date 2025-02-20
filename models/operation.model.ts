import mongoose, {Schema, model} from "mongoose";

export interface IOperation {
    name: string
    description: string
    }

const operationSchema = new Schema<IOperation>({
    name: 
    {
        type: String,
        required: true,
        unique: true
    },
    description: { 
        type: String,
        required: true
    }
}, {timestamps: true})

const Operation = mongoose.models.Operation || model<IOperation>('Operation', operationSchema)

export default Operation