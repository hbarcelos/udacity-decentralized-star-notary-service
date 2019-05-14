const StarNotary = artifacts.require('StarNotary')

let accounts

contract('StarNotary', accs => {
  accounts = accs
})

it('can Create a Star', async () => {
  const tokenId = 1
  const instance = await StarNotary.deployed()
  await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] })
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
})

it('lets user1 put up their star for sale', async () => {
  const instance = await StarNotary.deployed()
  const user1 = accounts[1]
  const starId = 2
  const starPrice = web3.utils.toWei('.01', 'ether')
  await instance.createStar('awesome star', starId, { from: user1 })
  await instance.putStarUpForSale(starId, starPrice, { from: user1 })
  assert.equal(await instance.starsForSale.call(starId), starPrice)
})

it('lets user1 get the funds after the sale', async () => {
  const instance = await StarNotary.deployed()
  const user1 = accounts[1]
  const user2 = accounts[2]
  const starId = 3
  const starPrice = web3.utils.toWei('.01', 'ether')
  const balance = web3.utils.toWei('.05', 'ether')
  await instance.createStar('awesome star', starId, { from: user1 })
  await instance.putStarUpForSale(starId, starPrice, { from: user1 })
  const balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1)
  await instance.buyStar(starId, { from: user2, value: balance })
  const balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1)
  const value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice)
  const value2 = Number(balanceOfUser1AfterTransaction)
  assert.equal(value1, value2)
})

it('lets user2 buy a star, if it is put up for sale', async () => {
  const instance = await StarNotary.deployed()
  const user1 = accounts[1]
  const user2 = accounts[2]
  const starId = 4
  const starPrice = web3.utils.toWei('.01', 'ether')
  const balance = web3.utils.toWei('.05', 'ether')
  await instance.createStar('awesome star', starId, { from: user1 })
  await instance.putStarUpForSale(starId, starPrice, { from: user1 })
  await instance.buyStar(starId, { from: user2, value: balance })
  assert.equal(await instance.ownerOf.call(starId), user2)
})

it('lets user2 buy a star and decreases its balance in ether', async () => {
  const instance = await StarNotary.deployed()
  const user1 = accounts[1]
  const user2 = accounts[2]
  const starId = 5
  const starPrice = web3.utils.toWei('.01', 'ether')
  const balance = web3.utils.toWei('.05', 'ether')
  await instance.createStar('awesome star', starId, { from: user1 })
  await instance.putStarUpForSale(starId, starPrice, { from: user1 })
  const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2)
  await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 })
  const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2)
  const value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar)
  assert.equal(value, starPrice)
})

it('can add the star name and star symbol properly', async () => {
  const instance = await StarNotary.deployed()
  const [tokenName, tokenSymbol] = await Promise.all([instance.name.call(), instance.symbol.call()])

  assert.equal(tokenName, 'FooBar')
  assert.equal(tokenSymbol, 'FBT')
})

it('lets 2 users exchange stars', async () => {
  const instance = await StarNotary.deployed()
  const user1 = accounts[1]
  const user2 = accounts[2]
  const star1 = {
    tokenId: 7,
    name: 'Awesome star',
  }
  const star2 = {
    tokenId: 11,
    name: 'Nope, this is an awesome star',
  }

  await Promise.all([
    instance.createStar(star1.name, star1.tokenId, {
      from: user1,
    }),
    instance.createStar(star2.name, star2.tokenId, {
      from: user2,
    }),
  ])

  await instance.exchangeStars(star1.tokenId, star2.tokenId, { from: user1 })

  const [ownerOf1, ownerOf2] = await Promise.all([
    instance.ownerOf.call(star1.tokenId),
    instance.ownerOf.call(star2.tokenId),
  ])

  assert.equal(ownerOf1, user2)
  assert.equal(ownerOf2, user1)
})

it('lets a user transfer a star', async () => {
  const instance = await StarNotary.deployed()
  const user1 = accounts[1]
  const user2 = accounts[2]
  const star1 = {
    tokenId: 13,
    name: 'Awesome star',
  }

  await instance.createStar(star1.name, star1.tokenId, {
    from: user1,
  })

  await instance.transferStar(user2, star1.tokenId, { from: user1 })

  const newOwner = await instance.ownerOf.call(star1.tokenId)

  assert.equal(newOwner, user2)
})

it('lookUptokenIdToStarInfo test', async () => {
  const instance = await StarNotary.deployed()
  const user1 = accounts[1]

  const star1 = {
    tokenId: 131,
    name: 'Awesome star',
  }

  await instance.createStar(star1.name, star1.tokenId, {
    from: user1,
  })

  const starName = await instance.lookUptokenIdToStarInfo.call(star1.tokenId)

  assert.equal(starName, star1.name)
})
