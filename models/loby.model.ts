import mongoose, {Schema, model} from "mongoose";

export interface ILoby {
    code: string
    host: string
    players: string[]
    helween: string[]
    wehsheen: string[]
    state ?: {player:string, operation:mongoose.Schema.Types.ObjectId, done:boolean}[]
    }

const lobySchema = new Schema<ILoby>({
    code: 
    {
        type: String,
        required: true,
        unique: true
    },
    host: { 
        type: String,
        required: true
    },
    players: { 
        type: [String],
        default: []
    },
    helween: { 
        type: [String],
        default: []
    },
    wehsheen: { 
        type: [String],
        default: []
    },
    state: { 
        type: [{player:String, operation:mongoose.Schema.Types.ObjectId, done:Boolean}],
        ref: 'Operation',
        default: []
    },
}, {timestamps: true})

const Loby = mongoose.models.Loby || model<ILoby>('Loby', lobySchema)

export default Loby