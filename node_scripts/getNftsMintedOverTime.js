#!/usr/bin/env node

const path = require("path")
const { ethers } = require("ethers")
const rpcProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.defibit.io/")

const fs = require('fs').promises
const contractJSON = require('../src/contracts/CryptozCard.json')
const testBSC = '0x7B1664842cdbB450BE8E1fA9Bb18aB147D097398'
const mainBSC = '0x8a0c542ba7bbbab7cf3551ffcc546cdc5362d2a1'

const contract = new ethers.Contract(mainBSC, contractJSON.abi, rpcProvider)

const blocksPerRequest = 1000

function getNFTsMintedFromEvents(events) {
  const mintEvent = events.filter(event => event.event === 'LogCardCreated')[0]

  if (!mintEvent) {
    return null
  }
  return mintEvent.args.cardTokenId.toNumber()
}

async function getLogs() {
  try{
    const filterCardCreated = [contract.filters.LogCardCreated()]
    const nftsOverTime = {}

    // We need to climb through blocks 5568565 - latest
    const firstBlock = 5568565
    const latestBlock = await contract.provider.getBlockNumber()
    let startDayBlock = firstBlock

    while (startDayBlock <= latestBlock) {
      let blockToScrape = startDayBlock
      let nftsMinted = null

      while (nftsMinted === null) {
        const events = await contract.queryFilter(filterCardCreated, blockToScrape, blockToScrape + blocksPerRequest)
        nftsMinted = getNFTsMintedFromEvents(events)
        blockToScrape += blocksPerRequest
      }
      const { timestamp } = await contract.provider.getBlock(startDayBlock)

      nftsOverTime[timestamp] = nftsMinted

      startDayBlock += 28800
    }

    await fs.writeFile(path.resolve(__dirname, '../chart_data/NFTsMintedOverTime.json'), JSON.stringify(nftsOverTime, null, 2))
  } catch (err) {
    console.error("ERROR:",err)
  }
}

getLogs()