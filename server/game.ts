"use server";
import Loby from "@/models/loby.model";
import { connectDB } from "@/lib/db";

export async function createLoby(host: string) {
    if (!host)
        return null
    await connectDB();
    let code = Math.random().toString(36).substring(7)
    while (!!(await Loby.findOne({code})))
        code = Math.random().toString(36).substring(7)
    const loby = new Loby({code, host, players: [host], helween: [], wehsheen: []})
    await loby.save()
    return JSON.parse(JSON.stringify(loby))
}

export async function joinLoby(code: string, player: string) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    loby.players.push(player)
    await loby.save()
    return loby
}

export async function leaveLoby(code: string, player: string) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    loby.players = loby.players.filter((p : string )=> p !== player)
    await loby.save()
    return loby
}

export async function getLoby(code: string) {
    await connectDB()
    return await Loby.findOne({code})
}

export async function getLobies() {
    await connectDB()
    return await Loby.find()
}

export async function getPlayers(code: string) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    return loby.players
}

export async function getHelween(code: string) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    return loby.helween
}

export async function getWehsheen(code: string) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    return loby.wehsheen
}

export async function getOperations(code: string) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    return loby.state
}

export async function setOperations(code: string, state: {player:string, operation:string, done:boolean}[]) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    loby.state = state
    await loby.save()
    return loby
}

export async function setHelween(code: string, helween: string[]) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    loby.helween = helween
    if (!loby.players.some((p : string) => !helween.includes(p)))
        return null
    await loby.save()
    return loby
}

export async function setWehsheen(code: string, wehsheen: string[]) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    if (!loby.players.some((p : string) => !wehsheen.includes(p)))
        return null
    loby.wehsheen = wehsheen
    await loby.save()
    return loby
}

export async function setPlayers(code: string, players: string[]) {
    await connectDB()
    const loby = await Loby.findOne({code})
    if (!loby)
        return null
    loby.players = players
    await loby.save()
    return loby
}

